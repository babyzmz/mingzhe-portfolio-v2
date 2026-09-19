/**
 * Media behaviour inside the existing case dialog lifecycle:
 * - enlarge (lightbox) is a mode of the case dialog; Escape exits media mode
 *   first and only closes the project on a second Escape (no focus-trap break);
 * - videos never autoplay in the gallery; they pause on close, project switch,
 *   locale rebuild, leaving the lightbox or scrolling out of view;
 * - broken images/videos show a readable fallback instead of a spinner;
 * - rapid opens and language switches leave no stray timers or background audio.
 */
import type {Locale} from './state.js';
import {gallery} from './project-media.js';
import type {ProjectId,ProjectMedia} from './project-types.js';
import {lightboxMediaHtml,lightboxShell} from './media-view.js';

export type MediaController={
 setLocale:(lang:Locale)=>void;
 observeVideos:()=>void;
 /** Returns true while media mode consumed a close attempt (first Escape). */
 consumeCloseAttempt:()=>boolean;
 pauseAll:()=>void;
 dispose:()=>void;
};

export function createMediaController(dialog:HTMLElement,getProject:()=>ProjectId|null,getLang:()=>Locale):MediaController{
 let lang=getLang();
 let open=false,index=0,items:ProjectMedia[]=[],origin:HTMLElement|null=null;
 let observer:IntersectionObserver|null=null;

 const stage=()=>dialog.querySelector<HTMLElement>('[data-media-stage]');
 const lightbox=()=>dialog.querySelector<HTMLElement>('[data-media-lightbox]');

 function pauseAll(){
  dialog.querySelectorAll<HTMLVideoElement>('video[data-media-video],video[data-media-lightbox-video]').forEach(video=>{
   video.pause();
  });
 }

 function ensureLightbox(){
  if(!lightbox())dialog.insertAdjacentHTML('beforeend',lightboxShell(lang));
  const box=lightbox()!;
  if(box.dataset.bound!=='1'){
   box.dataset.bound='1';
   box.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    if(target.closest('[data-media-close]')||target.classList.contains('media-lightbox')){closeLightbox();return}
    const step=target.closest<HTMLElement>('[data-media-step]');
    if(step)move(Number(step.dataset.mediaStep));
   });
  }
 }

 function observeVideos(){
  observer?.disconnect();
  if(typeof IntersectionObserver==='undefined')return;
  observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    const video=entry.target as HTMLVideoElement;
    if(!entry.isIntersecting)video.pause();
   }
  },{root:dialog.querySelector('.case-scroll'),threshold:.05});
  dialog.querySelectorAll('video[data-media-video]').forEach(video=>observer!.observe(video));
 }

 function renderStage(){
  const box=lightbox(),s=stage();
  if(!box||!s)return;
  const item=items[index];
  if(!item){closeLightbox();return}
  s.innerHTML=lightboxMediaHtml(item,lang,index,items.length);
  const text=dialog.querySelector('[data-media-caption]');
  if(text)text.textContent=item.caption[lang]+' · '+item.provenance[lang];
  box.setAttribute('aria-busy','false');
 }

 function openLightbox(itemIndex:number,trigger:HTMLElement){
  const id=getProject();
  items=id?gallery(id):[];
  if(items.length===0)return;
  index=(itemIndex+items.length)%items.length;
  origin=trigger;
  ensureLightbox();
  const box=lightbox()!;
  box.hidden=false;
  box.dataset.mediaMode='open';
  renderStage();
  open=true;
  (box.querySelector('[data-media-close]') as HTMLElement)?.focus();
 }

 function closeLightbox(){
  if(!open)return;
  const box=lightbox();
  open=false;
  pauseAll();
  // Drop the lightbox media source so playback/download stops completely.
  const s=stage();if(s)s.innerHTML='';
  if(box){box.hidden=true;box.dataset.mediaMode='closed'}
  origin?.isConnected?origin.focus():dialog.querySelector<HTMLElement>('[data-case-id]')?.focus();
 }

 function move(delta:number){
  if(!open)return;
  pauseAll();
  index=(index+delta+items.length)%items.length;
  renderStage();
 }

 function onKeydown(event:KeyboardEvent){
  if(!open)return;
  if(event.key==='Escape'){event.stopPropagation();event.preventDefault();closeLightbox();return}
  if(event.key==='ArrowRight')move(1);
  if(event.key==='ArrowLeft')move(-1);
  if(event.key==='Tab'){
   const box=lightbox();
   if(!box)return;
   const focusables=Array.from(box.querySelectorAll<HTMLElement>('button,video[controls],a[href]')).filter(el=>!el.hidden);
   if(focusables.length===0)return;
   const first=focusables[0],last=focusables[focusables.length-1];
   const active=document.activeElement as HTMLElement;
   if(event.shiftKey&&active===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&active===last){event.preventDefault();first.focus()}
  }
 }

 // Delegated bindings survive dialog innerHTML replacement on switch/locale.
 function onClick(event:MouseEvent){
  const target=event.target instanceof Element?event.target:null;
  if(!target)return;
  const opener=target.closest<HTMLElement>('[data-media-open]');
  if(opener&&dialog.contains(opener)){
   event.preventDefault();
   openLightbox(Number(opener.dataset.mediaIndex||0),opener);
  }
 }
 function onKeyActivate(event:KeyboardEvent){
  if(event.key!=='Enter'&&event.key!==' ')return;
  const target=event.target instanceof Element?event.target:null;
  const opener=target?.closest?.('[data-media-open]');
  if(opener&&dialog.contains(opener)){event.preventDefault();openLightbox(Number((opener as HTMLElement).dataset.mediaIndex||0),opener as HTMLElement)}
 }
 function onMediaError(event:Event){
  const target=event.target;
  if(!(target instanceof HTMLElement))return;
  const figure=target.closest<HTMLElement>('.media-item,.mini-shot');
  if(figure){
   figure.dataset.mediaState='error';
   // The fallback note ships with the hidden attribute; reveal it explicitly,
   // since Chromium keeps [hidden] elements at display:none even when an
   // author rule would otherwise apply.
   figure.querySelector('[data-media-broken]')?.removeAttribute('hidden');
  }
  target.hidden=true;
 }

 dialog.addEventListener('click',onClick,true);
 dialog.addEventListener('keydown',onKeyActivate,true);
 dialog.addEventListener('keydown',onKeydown,true);
 dialog.addEventListener('error',onMediaError,true);
 // Any removed video (switch/locale/close) is paused before it leaves the DOM.
 const mutation=new MutationObserver(records=>{
  for(const record of records){
   record.removedNodes.forEach(node=>{
    if(node instanceof HTMLElement)node.querySelectorAll('video').forEach(video=>video.pause());
   });
  }
  if(!dialog.querySelector('[data-media-gallery]'))observer?.disconnect();
 });
 mutation.observe(dialog,{childList:true,subtree:true});

 return{
  setLocale(value){lang=value;if(open){const box=lightbox();if(box)closeLightbox()}},
  consumeCloseAttempt(){if(open){closeLightbox();return true}return false},
  pauseAll,
  observeVideos,
  dispose(){
   pauseAll();open=false;
   dialog.removeEventListener('click',onClick,true);
   dialog.removeEventListener('keydown',onKeyActivate,true);
   dialog.removeEventListener('keydown',onKeydown,true);
   dialog.removeEventListener('error',onMediaError,true);
   observer?.disconnect();mutation.disconnect();
  }
 };
}
