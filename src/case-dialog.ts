/** One lifecycle for both story and archive entry points. Native dialog semantics
 * remain in place; close() runs only AFTER the exit animation has finished.
 * No CDN, optional GSAP module or WebGL context is required for these animations.
 */
export type CaseDialogOptions = {
 reduced: () => boolean;
 onClosed: () => void;
 onOpened: () => void;
 /** Return true to consume the close attempt (e.g. media mode is still open). */
 onCloseAttempt?: () => void | boolean;
};
export type CaseDialogController = {
 open: (html:string, id:string, trigger?:HTMLElement|null, preservePosition?:boolean) => Promise<void>;
 close: () => Promise<void>;
 jump: (id:string) => void;
 toggleGlossary: (button:HTMLElement) => Promise<void>;
 updateMotion: () => void;
 dispose: () => void;
};
type Phase = 'closed'|'opening'|'open'|'switching'|'closing';
export function createCaseDialog(dialog:HTMLDialogElement,options:CaseDialogOptions):CaseDialogController {
 let phase:Phase='closed',generation=0,focusReturn:HTMLElement|null=null,returnSelector='',originalOverflow='',originalPadding='',pageY=0;
 let scrollRoot:HTMLElement|null=null,observer:IntersectionObserver|null=null,scrollFrame=0;
 let origin={x:0,y:40};
 const animations=new Set<Animation>();
 const glossaryEpoch=new WeakMap<HTMLElement,number>();
 const reduced=()=>options.reduced()||typeof dialog.animate!=='function';
 const setPhase=(value:Phase)=>{phase=value;dialog.dataset.phase=value};
 function cancelAnimations(){for(const animation of [...animations])animation.cancel();animations.clear()}
 function animate(el:Element,frames:Keyframe[],timing:KeyframeAnimationOptions):Promise<void>{
  if(reduced())return Promise.resolve();
  const animation=el.animate(frames,{easing:'cubic-bezier(.2,.8,.2,1)',fill:'both',...timing});
  animations.add(animation);
  // Cancellation is expected during rapid switches, Escape and reduced-motion changes.
  return animation.finished.then(()=>undefined,()=>undefined).then(()=>{animations.delete(animation);animation.cancel()});
 }
 function clearReading(){
  observer?.disconnect();observer=null;
  scrollRoot?.removeEventListener('scroll',scheduleReading);
  cancelAnimationFrame(scrollFrame);scrollFrame=0;
 }
 function reading(){
  scrollFrame=0;if(!scrollRoot)return;
  const total=scrollRoot.scrollHeight-scrollRoot.clientHeight;
  const fraction=total>0?Math.min(1,Math.max(0,scrollRoot.scrollTop/total)):1;
  const bar=dialog.querySelector<HTMLElement>('[data-reading-bar]');
  if(bar)bar.style.transform=`scaleX(${fraction})`;
  const label=dialog.querySelector('[data-reading-label]');if(label)label.textContent=String(Math.round(fraction*100)).padStart(2,'0')+'%';
  const cutoff=scrollRoot.getBoundingClientRect().top+150;
  let active='overview';
  dialog.querySelectorAll<HTMLElement>('[data-case-section]').forEach(section=>{if(section.getBoundingClientRect().top<=cutoff)active=section.dataset.caseSection!});
  dialog.querySelectorAll<HTMLElement>('[data-case-jump]').forEach(button=>{
   if(button.dataset.caseJump===active)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current');
  });
 }
 function scheduleReading(){if(!scrollFrame)scrollFrame=requestAnimationFrame(reading)}
 function reveal(el:HTMLElement,delay=0){
  if(el.dataset.revealed==='true')return;
  el.dataset.revealed='true';el.style.opacity='';el.style.transform='';
  void animate(el,[{opacity:0,transform:'translate3d(0,24px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:560,delay});
 }
 function prepareReading(){
  clearReading();scrollRoot=dialog.querySelector<HTMLElement>('.case-scroll');if(!scrollRoot)return;
  scrollRoot.addEventListener('scroll',scheduleReading,{passive:true});
  const nodes=Array.from(dialog.querySelectorAll<HTMLElement>('[data-reveal]'));
  if(!reduced()&&typeof IntersectionObserver!=='undefined'){
   observer=new IntersectionObserver(entries=>{
    let order=0;
    for(const entry of entries)if(entry.isIntersecting){reveal(entry.target as HTMLElement,Math.min(order++*55,165));observer?.unobserve(entry.target)}
   },{root:scrollRoot,threshold:.04,rootMargin:'0px 0px -20px 0px'});
   nodes.forEach(el=>{el.dataset.revealed='false';el.style.opacity='0';el.style.transform='translate3d(0,24px,0)';observer!.observe(el)});
  }else nodes.forEach(el=>{el.dataset.revealed='true';el.style.opacity='';el.style.transform=''});
  reading();
 }
 function lock(trigger?:HTMLElement|null){
  focusReturn=trigger||document.activeElement as HTMLElement;
  const card=focusReturn?.closest<HTMLElement>('[data-project-card]');
  returnSelector=card?`[data-project-card="${card.dataset.projectCard}"] [data-case]`:focusReturn?.dataset.case?`#site [data-case="${focusReturn.dataset.case}"]`:'#site [data-evidence]';
  pageY=window.scrollY;originalOverflow=document.body.style.overflow;originalPadding=document.body.style.paddingRight;
  const gap=Math.max(0,innerWidth-document.documentElement.clientWidth);
  document.body.style.overflow='hidden';if(gap)document.body.style.paddingRight=`${gap}px`;
  document.body.classList.add('case-is-open');options.onOpened();
  if(trigger){const r=trigger.getBoundingClientRect();origin={x:Math.max(-100,Math.min(100,(r.left+r.width/2-innerWidth/2)*.18)),y:Math.max(-60,Math.min(80,(r.top+r.height/2-innerHeight/2)*.18))};}
 }
 function unlocked(){
  if(phase==='closed')return;
  generation++;cancelAnimations();clearReading();scrollRoot=null;setPhase('closed');
  document.body.style.overflow=originalOverflow;document.body.style.paddingRight=originalPadding;document.body.classList.remove('case-is-open');
  const target=focusReturn?.isConnected?focusReturn:document.querySelector<HTMLElement>(returnSelector);
  window.scrollTo({top:pageY,behavior:'instant' as ScrollBehavior});target?.focus({preventScroll:true});focusReturn=null;
  options.onClosed();
 }
 async function open(html:string,id:string,trigger?:HTMLElement|null,preservePosition=false){
  const token=++generation;
  const replacing=dialog.open;
  const oldFraction=scrollRoot&&preservePosition?scrollRoot.scrollTop/Math.max(1,scrollRoot.scrollHeight-scrollRoot.clientHeight):0;
  const oldBody=dialog.querySelector<HTMLElement>('.case-scroll');
  cancelAnimations();clearReading();
  dialog.dataset.caseMotion=reduced()?'reduced':'full';
  if(replacing){
   setPhase('switching');
   if(oldBody)await animate(oldBody,[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-25px)'}],{duration:170});
   if(token!==generation||!dialog.open)return;
  }else lock(trigger);
  dialog.innerHTML=html;dialog.dataset.project=id;
  if(!replacing)dialog.showModal();
  setPhase('opening');dialog.scrollTop=0;
  scrollRoot=dialog.querySelector<HTMLElement>('.case-scroll');
  if(scrollRoot)scrollRoot.scrollTop=preservePosition?oldFraction*(scrollRoot.scrollHeight-scrollRoot.clientHeight):0;
  dialog.querySelector<HTMLElement>('#dialog-title')?.focus({preventScroll:true});
  prepareReading();
  dialog.querySelectorAll<HTMLElement>('[data-case-intro]').forEach((el,i)=>{
   void animate(el,[{opacity:0,transform:'translate3d(0,22px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:550,delay:90+i*55});
  });
  const art=dialog.querySelector<HTMLElement>('[data-case-art]');
  if(art)void animate(art,[{opacity:0,transform:'perspective(800px) rotateY(-12deg) scale(.87)'},{opacity:1,transform:'perspective(800px) rotateY(0deg) scale(1)'}],{duration:780,delay:100});
  if(replacing){
   if(scrollRoot)await animate(scrollRoot,[{opacity:0,transform:'translateX(26px)'},{opacity:1,transform:'translateX(0)'}],{duration:460});
  }else await animate(dialog,[{opacity:0,transform:`translate3d(${origin.x}px,${origin.y+46}px,0) scale(.91)`},{opacity:1,transform:'translate3d(0,0,0) scale(1)'}],{duration:580});
  if(token===generation&&dialog.open){setPhase('open');reading()}
 }
 async function close(){
  if(!dialog.open||phase==='closing')return;
  if(options.onCloseAttempt?.())return;
  const token=++generation;
  const style=getComputedStyle(dialog),fromOpacity=style.opacity,fromTransform=style.transform;
  cancelAnimations();clearReading();setPhase('closing');
  await animate(dialog,[{opacity:fromOpacity,transform:fromTransform},{opacity:0,transform:`translate3d(${origin.x*.35}px,${Math.max(25,origin.y*.35+30)}px,0) scale(.97)`}],{duration:290,easing:'cubic-bezier(.4,0,.8,.2)'});
  if(token===generation&&dialog.open){dialog.close();unlocked()}
 }
 function jump(id:string){
  if(!scrollRoot)return;
  const target=Array.from(dialog.querySelectorAll<HTMLElement>('[data-case-section]')).find(el=>el.dataset.caseSection===id);if(!target)return;
  const toc=dialog.querySelector<HTMLElement>('.case-toc');
  const top=target.getBoundingClientRect().top-scrollRoot.getBoundingClientRect().top+scrollRoot.scrollTop-(toc?.offsetHeight??0)-22;
  scrollRoot.scrollTo({top:Math.max(0,top),behavior:reduced()?'instant' as ScrollBehavior:'smooth'});
 }
 async function toggleGlossary(button:HTMLElement){
  const id=button.getAttribute('aria-controls'),panel=id?dialog.querySelector<HTMLElement>('#'+id):null;
  if(!panel)return;
  const token=(glossaryEpoch.get(panel)||0)+1;glossaryEpoch.set(panel,token);
  const expand=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(expand));
  const label=button.querySelector('small'),count=panel.querySelectorAll('dt').length,zh=document.documentElement.lang.startsWith('zh');
  if(label)label.textContent=zh?`${count} 个术语 · 点击${expand?'收起':'展开'}`:`${count} terms · tap to ${expand?'collapse':'expand'}`;
  const current=panel.hidden?0:panel.getBoundingClientRect().height;
  const opacity=panel.hidden?0:Number(getComputedStyle(panel).opacity);
  for(const animation of panel.getAnimations())animation.cancel();
  if(expand)panel.hidden=false;
  const destination=expand?panel.scrollHeight:0;
  panel.style.overflow='hidden';
  await animate(panel,[{height:`${current}px`,opacity},{height:`${destination}px`,opacity:expand?1:0}],{duration:340});
  // A reversed click supersedes the previous completion.
  if(glossaryEpoch.get(panel)!==token)return;
  panel.hidden=!expand;panel.style.overflow='';scheduleReading();
 }
 function updateMotion(){
  dialog.dataset.caseMotion=reduced()?'reduced':'full';
  if(reduced()){cancelAnimations();dialog.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el=>{el.style.opacity='';el.style.transform='';el.dataset.revealed='true'});observer?.disconnect();observer=null}
 }
 const onCancel=(event:Event)=>{event.preventDefault();void close()};
 const onClose=()=>{if(!dialog.open)unlocked()};
 const onBackdrop=(event:MouseEvent)=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)void close()};
 dialog.addEventListener('cancel',onCancel);dialog.addEventListener('close',onClose);dialog.addEventListener('click',onBackdrop);
 window.addEventListener('resize',scheduleReading,{passive:true});
 return {open,close,jump,toggleGlossary,updateMotion,dispose:()=>{
  generation++;cancelAnimations();clearReading();if(dialog.open){dialog.close();unlocked()}
  dialog.removeEventListener('cancel',onCancel);dialog.removeEventListener('close',onClose);dialog.removeEventListener('click',onBackdrop);window.removeEventListener('resize',scheduleReading);
 }};
}
