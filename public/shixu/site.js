(()=>{
  'use strict';
  document.documentElement.dataset.input='keyboard';
  document.addEventListener('pointerdown',()=>{document.documentElement.dataset.input='pointer';},{capture:true,passive:true});
  document.addEventListener('keydown',()=>{document.documentElement.dataset.input='keyboard';},true);
  // Chinese lives in the HTML; English replaces tagged content so static pages stay readable without JS.
  const go=text=>text+' <span aria-hidden="true">↗</span>',down=text=>text+' <span aria-hidden="true">↓</span>';
  const en={
    'release.android13.kicker':'Android 0.2.13 · October 21, 2026','release.android13.title':'A fuller calendar. Quicker swipe actions.',
    'release.android13.gestures':'Year, month, week and day views on phones and tablets, with overdue tasks, past plans and ended events. Swipe left to edit or delete; continue and release to delete with Undo. Swipe right to complete or restore tasks; daily targets and events only record one completion.',
    'release.android13.calendar':'System calendar settings now offer syncing current events, target counts and retry feedback. Only valid events are mirrored, not tasks or notes. The cloud assistant still proposes changes for confirmation before saving; an app save receipt does not confirm a system calendar write.',
    'release.android13.limits':'Improved narrow-screen filters, gestures starting on row buttons, editor input and reduced motion. Permissions, network access and battery policies still affect reminders and background sync; continuous lock-screen updates are not guaranteed. The Windows download stays at 0.4.26; iOS and macOS downloads remain unavailable.',
    'platform.choose':'Choose a platform','platform.downloads':'Platform downloads','platform.windows':'Windows','platform.android':'Android','platform.soon':'Coming soon','platform.available':'Available now','platform.download':'Download','platform.testDownload':'Download beta',
    'platform.windows.version':'0.4.26 · x64 · 84.7 MiB','platform.windows.description':'Native desktop widgets, tray reminders and a global assistant.','platform.windows.requirements':'Windows 10 2004+ / Windows 11<br>ZIP archive. Extract, then run.','platform.windows.downloadLabel':'Download for Windows',
    'platform.android.version':'0.2.13 · Limited testing · 3.7 MiB','platform.android.description':'Your workbench on phones and tablets. Capture a thought and keep going.','platform.android.requirements':'Android 7+ · Recent System WebView<br>APK package. Allow installation from this source.','platform.android.downloadLabel':'Download Android beta',
    'platform.ios.version':'Future platform','platform.ios.description':'Planned for iPhone and iPad. Not available to download yet.','platform.ios.requirements':'No app package released yet.<br>Use the web workbench for now.',
    'platform.macos.version':'Future platform','platform.macos.description':'Planned for Mac. Not available to download yet.','platform.macos.requirements':'No app package released yet.<br>Use the web workbench for now.',
    'devices.android.h':'Android phones and tablets','devices.android.p':'Capture a task, check your calendar and continue with the same account. Optional local reminders and system calendar connection.','devices.android.a':go('Choose Android'),
    'android.install.h':'Android.<br>Install and start capturing.','android.install.p':'Open the downloaded APK and allow installation from this source when prompted. Sign in to the same Fairy account to sync items and categories.',
    'android.h':'Shixu,<br>on your phone.',
    'android.p':'Android 0.2.13 small-group test build · about 4 MB. The shared web workbench with account sync, optional system calendar integration and local reminders.',
    'android.download':down('Download Android test build'),
    'android.note':'A recent System WebView is required. Enable reminders and lock-screen sync in settings, and allow notifications and background activity. Network loss or force-stop interrupts sync.',
    'home.title':'Shixu — Pick up the pieces. Shape your day.',
    'home.description':'Shixu gathers scattered to-dos, events and notes in one place. Windows desktop widgets and a web workbench keep your plans with you.',
    'download.title':'Download Shixu — Windows, Android, iOS and macOS',
    'download.description':'Get Shixu for Windows and Android, see iOS and macOS availability, or open the web workbench.',
    skip:'Skip to main content',brand:'Shixu','brand.home':'Shixu home','nav.label':'Site navigation',
    'nav.tour':'Tour','nav.web':go('Web app'),'nav.desktop':'Downloads',
    'cta.get':go('Download Shixu'),'cta.getDown':down('Download Shixu'),'cta.windows':down('Download for Windows'),'cta.tryWeb':go('Try the web app first'),'cta.openWeb':go('Open the web app'),
    'hero.l1':'Pick up the pieces.','hero.l2':'Shape your day.',
    'hero.intro':'To-dos, events and notes, all in one place.<br>Keep the next step in sight, and your time for yourself.',
    'hero.alt':'Shixu Today workbench showing priority to-dos, a schedule timeline and notes together',
    'hero.caption':'Your next step already has a place.','hero.explore':down('Explore'),
    'story.title':'From scattered to sorted.','story.nav':'Choose a product scene',
    'story.tab0':'Capture','story.tab1':'Plan','story.tab2':'Widgets','story.tab3':'Assistant',
    's0.h':'Write it down.<br>Sort it out later.','s0.p':'Jot down a to-do or keep a quick note. Categories and small steps turn ideas into things you can start.',
    's0.alt':'Quick capture, to-dos and sticky notes on the Today page','s0.cap':'Today workbench · sample items',
    's1.h':'See your day<br>at a glance.','s1.p':'Switch between year, month, week and day views. Planned time, due dates and reminders stay separate, so your plans stay clear.',
    's1.alt':'Shixu week calendar with a product review scheduled at 3 PM','s1.cap':'Week calendar · planned time never replaces the due date',
    's2.h':'Your next step,<br>right on the desktop.','s2.p':'On Windows, to-dos, events and categories become standalone widgets. When you get back to work, what matters is still in view.',
    's2.alt':'Example layout of to-dos and events as standalone widgets on a canvas','s2.cap':'Widget layout preview · native desktop widgets run on Windows',
    's3.h':'Ask the question.<br>You make the call.','s3.p':'Look things up, break down to-dos, schedule and check for conflicts. Replies link back to the original records, and every change is previewed before you confirm.',
    's3.alt':'The assistant lists this week’s to-dos with links to the original records','s3.cap':'Local web assistant · cloud models configurable on desktop',
    'devices.h':'Switch screens.<br>Keep going.','devices.p':'Focus on your PC, pick up in the browser. Once you sign in, items and categories sync across your devices with encryption.',
    'devices.alt':'Light web workbench for viewing and editing personal to-dos','devices.cap':'Web app · start capturing without installing',
    'devices.win.h':'Windows desktop','devices.win.p':'Native widgets, tray reminders, a focus timer and automatic updates. Your workbench can stay on your desktop, too.','devices.win.a':go('Choose desktop'),
    'devices.web.h':'Web workbench','devices.web.p':'Open a browser and start. Already using the desktop app? Sign in with your Fairy account.',
    'devices.note':'Without signing in, everything stays on this device. Sync is optional, data is encrypted before upload, and everyone uses their own account.',
    'faq.h':'Before you start,<br>you might wonder.',
    'faq.q1':'What’s the easiest way to start?','faq.a1':'To try capturing and the calendar, just open the web app. For native desktop widgets, tray reminders and automatic updates, download the Windows version, extract it and run Shixu.exe.',
    'faq.q2':'Do the web and desktop apps share the same records?','faq.a2':'Sign in to the same account on both. Click “Sign in” at the bottom left of the web or desktop workbench, create a Fairy account, then sign in on the other side with the same username and password. Items and categories are then encrypted on your device and synced automatically.',
    'faq.q3':'Does the assistant need an API key?','faq.a3':'Basic lookups, explicit captures and local rule-based scheduling don’t need an API. More advanced cloud model features on desktop require a model and a valid key in settings; model costs depend on the service you choose. The web app currently uses a local rule-based assistant.',
    'faq.q4':'Will I still get reminders after closing the web page?','faq.a4':'Web reminders need the page to stay open. For tray reminders, use the Windows version; notifications aren’t guaranteed while the app is fully closed or the device is asleep.',
    'closing.h':'Give today<br>a clear start.','closing.p':'Begin by writing down one thing.',
    'footer.download':'Downloads','footer.web':'Web workbench','footer.home':'Back to home','footer.tagline':'Shixu · A place for everything','footer.sample':'Screens show sample items and contain no user records.',
    'dl.l1':'Choose your device.','dl.l2':'Keep your plans close.','dl.intro':'Available for Windows and Android.<br>Choose your usual device, or open the web app.',
    'dl.icon':'Shixu app icon','dl.windows':'Windows','dl.req':'Windows 10 2004 (19041) or later, or Windows 11, on an x64 PC.<br>ZIP archive. Extract, then run.','dl.tryWeb':go('Try the web app first'),
    'dl.previewAlt':'Preview of to-dos, schedule and notes in the dark Shixu workbench','dl.previewCap':'Everything has its place.',
    'install.h':'Extract. Open.<br>Start writing.',
    'install.1h':'Extract to a permanent folder','install.1p':'Keep every file from the archive. Don’t launch from inside the ZIP, and don’t copy only the EXE.',
    'install.2h':'Run Shixu.exe','install.2p':'Write down a to-do, schedule an event or leave a note. Desktop widgets can be created inside the app.',
    'install.3h':'Connect the web when you need it','install.3p':'Sign in to the same Fairy account on desktop and web, and items and categories sync automatically with encryption.',
    'release.h':'This release keeps<br>your records moving.','release.current':zh=>'Current release '+((zh.match(/\d+\.\d+\.\d+/)||[''])[0]),
    'release.1h':'Encrypted sync between web and desktop','release.1p':'Items and categories are encrypted on your device before they reach your account. API keys, chat history and desktop window settings stay on this PC.',
    'release.2h':'Resolve conflicts, then continue','release.2p':'Changes to different records merge. Concurrent edits to the same record pause sync and keep both versions for you to choose from.',
    'release.3h':'Everything you use daily stays','release.3p':'To-dos, events, notes, categories, desktop widgets, focus and the assistant, all still in one workbench.',
    'release.checksum':'View archive checksum',
    'alt.h':'Or just<br>open it in a browser.','alt.p':'No install needed. Capture to-dos, edit events and tidy notes. Once signed in, continue the same plans you have on desktop.','alt.btn':go('Open the web workbench'),
    'alt.note':'The web assistant currently uses local rules. For native widgets and tray reminders, use the Windows version.',
    'download.started':'Download link opened. When it finishes, extract all files before running.',
    'support.label':'Product support','support.fairy':'Fairy family','support.changelog':'Changelog','support.help':'Help','support.privacy':'Privacy',
    'lang.switch':'中文','lang.switchLabel':'切换到中文'
  };
  const zh={'download.started':'已打开下载链接。下载完成后，解压全部文件再运行。','lang.switch':'English','lang.switchLabel':'Switch to English'};
  const root=document.documentElement,page=document.body.dataset.page,saved=new Map(),savedAttrs=new Map();
  const head={title:document.title,description:document.querySelector('meta[name="description"]')?.content||''};
  let lang='zh';
  try{lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('shixu-lang')||(/^zh\b/i.test(navigator.language||'zh')?'zh':'en');}catch{}
  lang=lang==='en'?'en':'zh';
  const t=key=>(lang==='en'?en:zh)[key];
  const switcher=document.createElement('button');
  switcher.type='button';switcher.className='lang-switch';
  document.querySelector('.site-header nav')?.append(switcher);
  function applyLanguage(){
    root.lang=lang==='en'?'en':'zh-CN';
    for(const el of document.querySelectorAll('[data-i18n]')){
      if(!saved.has(el))saved.set(el,el.innerHTML);
      const value=lang==='en'?en[el.dataset.i18n]:null;
      el.innerHTML=value==null?saved.get(el):typeof value==='function'?value(saved.get(el)):value;
    }
    for(const el of document.querySelectorAll('[data-i18n-attr]'))for(const pair of el.dataset.i18nAttr.split(';')){
      const [attr,key]=pair.split(':');
      if(!savedAttrs.has(el))savedAttrs.set(el,{});
      const original=savedAttrs.get(el);if(!(attr in original))original[attr]=el.getAttribute(attr);
      el.setAttribute(attr,lang==='en'&&en[key]!=null?en[key]:original[attr]);
    }
    if(page){document.title=lang==='en'?en[page+'.title']:head.title;document.querySelector('meta[name="description"]')?.setAttribute('content',lang==='en'?en[page+'.description']:head.description);}
    switcher.textContent=t('lang.switch');switcher.lang=lang==='en'?'zh-CN':'en';switcher.setAttribute('aria-label',t('lang.switchLabel'));
    document.querySelectorAll('.download-state').forEach(note=>note.textContent=t('download.started'));
    root.classList.remove('i18n-pending');
  }
  switcher.addEventListener('click',()=>{
    lang=lang==='en'?'zh':'en';
    try{localStorage.setItem('shixu-lang',lang);}catch{}
    try{const url=new URL(location.href);if(url.searchParams.has('lang')){url.searchParams.set('lang',lang);history.replaceState(history.state,'',url);}}catch{}
    applyLanguage();
    if(window.ScrollTrigger)window.ScrollTrigger.refresh();
  });
  applyLanguage();
  if(!document.currentScript?.hasAttribute('data-release-notes')&&'serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),story=document.querySelector('.product-story'),buttons=[...document.querySelectorAll('[data-scene]')];
  let storyTrigger=null,active=-1;
  const scenes=[...document.querySelectorAll('.story-scene')];
  function activate(index){if(index===active)return;active=index;buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));scenes.forEach((scene,i)=>scene.setAttribute('aria-hidden',String(!!storyTrigger&&i!==index)));}
  buttons.forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.scene);if(storyTrigger){window.ScrollTrigger.refresh();const distance=storyTrigger.end-storyTrigger.start;window.scrollTo({top:storyTrigger.start+distance*((index+.55)/4),behavior:reduced.matches?'instant':'smooth'});}else scenes[index].scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});activate(index);}));
  // Everything is visible before JS; no script/library failure leaves a blank story.
  if(window.gsap&&window.ScrollTrigger){
    const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      gsap.from('.title-line>span',{yPercent:106,duration:1.05,ease:'power3.out',stagger:.11,clearProps:'transform'});
      gsap.from('.hero-intro,.download-package',{y:24,opacity:0,duration:.8,delay:.22,stagger:.08,ease:'power2.out',clearProps:'transform,opacity'});
      gsap.from('.hero-stage',{clipPath:'inset(18% 0 0 0 round 36px)',duration:1.25,ease:'power3.out',clearProps:'clipPath'});
      if(document.querySelector('.hero-stage'))gsap.to('.hero-screen',{scale:1.045,yPercent:-2,ease:'none',scrollTrigger:{trigger:'.hero-stage',start:'top 85%',end:'bottom top',scrub:1}});
      for(const section of document.querySelectorAll('.section-space')){
        const parts=[...section.querySelectorAll('h2,h3,p,.button,figure,details,li')].filter(e=>!e.closest('details:not([open])')||e.tagName==='DETAILS');
        gsap.from(parts,{y:22,opacity:0,duration:.65,stagger:.055,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 84%',once:true},clearProps:'transform,opacity'});
      }
    });
    media.add('(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)',()=>{
      if(!story)return;
      story.classList.add('story-enhanced');
      gsap.set(scenes.slice(1),{autoAlpha:0});
      const stage=story.querySelector('.story-stage');
      const timeline=gsap.timeline({scrollTrigger:{trigger:stage,start:'top top',end:()=>'+='+Math.max(innerHeight*3.2,2300),pin:true,scrub:.65,invalidateOnRefresh:true,onUpdate:self=>activate(Math.min(3,Math.floor(self.progress*4)))}});
      storyTrigger=timeline.scrollTrigger;activate(0);
      timeline.to({}, {duration:1});
      for(let i=1;i<scenes.length;i++){
        const at=i;
        timeline.to(scenes[i-1],{autoAlpha:0,y:-20,duration:.22,ease:'power1.inOut'},at);
        timeline.fromTo(scenes[i],{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.32,ease:'power2.out'},at+.04);
        timeline.fromTo(scenes[i].querySelector('img'),{scale:1.035},{scale:1,duration:.7,ease:'power2.out'},at+.04);
      }
      timeline.to({}, {duration:.8},3.3);
      gsap.fromTo('.story-progress span',{scaleX:.04},{scaleX:1,ease:'none',scrollTrigger:{trigger:stage,start:'top top',end:()=>'+='+Math.max(innerHeight*3.2,2300),scrub:true}});
      return()=>{storyTrigger=null;active=-1;story.classList.remove('story-enhanced');scenes.forEach(scene=>scene.removeAttribute('aria-hidden'));};
    });
    window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
    document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{
      ScrollTrigger.refresh();
      if(details.open&&!reduced.matches&&document.documentElement.dataset.input==='pointer')
        gsap.fromTo([...details.children].filter(el=>el.tagName!=='SUMMARY'),{opacity:.7,y:4},{opacity:1,y:0,duration:.2,ease:'power2.out',overwrite:true,clearProps:'transform,opacity'});
    }));
  }
  for(const download of document.querySelectorAll('[data-download]'))download.addEventListener('click',()=>{let note=download.parentElement.querySelector('.download-state');if(!note){note=document.createElement('p');note.className='download-state';note.setAttribute('role','status');download.after(note);}note.textContent=t('download.started');});
  // Footer signature: the wordmark is cut into glass shards that assemble on view, crack under the pointer and burst on click/tap.
  // Decorative only (the signature is aria-hidden); the plain text stays in the DOM and is shown whenever motion is reduced or canvas is unavailable.
  (()=>{
    const word=document.querySelector('.footer-signature>span');
    if(!word||!window.ResizeObserver||!window.IntersectionObserver)return;
    const opt={shard:.09,irregularity:.6,crack:.6,crackRadius:.5,heal:.9,shatterRadius:.42,force:1,spin:1,depth:1,reassemble:1.1,stiffness:.55,glint:.8,intro:1.6,autoplay:6};
    const rand=(a,b)=>a+Math.random()*(b-a);
    let canvas=null,ctx=null,base=null,shards=[],geo=null,frame=0,last=0,visible=false,introDone=false,pointer=null,lastPointer=0,autoplayAt=0,rebuildTimer=0,observers=[];
    function readStyle(){
      const s=getComputedStyle(word),parent=getComputedStyle(word.parentElement);
      return {text:word.textContent.trim(),size:parseFloat(s.fontSize),font:`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`,spacing:parseFloat(s.letterSpacing)||0,color:parent.color,accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#aaa4f6'};
    }
    function drawText(c,st,x,baseline){
      c.font=st.font;c.fillStyle=st.color;c.textBaseline='alphabetic';
      // Per-glyph advance keeps the CSS letter-spacing without relying on ctx.letterSpacing support.
      for(const ch of st.text){c.fillText(ch,x,baseline);x+=c.measureText(ch).width+st.spacing;}
    }
    function build(){
      const st=readStyle();if(!st.text||!st.size)return teardown();
      const rect=word.getBoundingClientRect(),w=rect.width,h=rect.height,em=st.size,pad=Math.round(em*.7),dpr=Math.min(2,window.devicePixelRatio||1);
      if(!canvas){canvas=document.createElement('canvas');canvas.className='shatter-canvas';ctx=canvas.getContext('2d');if(!ctx)return teardown(true);word.append(canvas);}
      const cw=w+pad*2,ch=h+pad*2;
      canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);Object.assign(canvas.style,{left:-pad+'px',top:-pad+'px',width:cw+'px',height:ch+'px'});
      // Base image of the whole word in canvas space, aligned with the CSS line box (line-height:1).
      base=document.createElement('canvas');base.width=canvas.width;base.height=canvas.height;
      const b=base.getContext('2d',{willReadFrequently:true});b.scale(dpr,dpr);b.font=st.font;
      const m=b.measureText(st.text),asc=m.fontBoundingBoxAscent??m.actualBoundingBoxAscent,desc=m.fontBoundingBoxDescent??m.actualBoundingBoxDescent;
      drawText(b,st,pad,pad+(h-(asc+desc))/2+asc);
      const mask=b.getImageData(0,0,base.width,base.height).data;
      // Jittered grid -> triangles; keep the ones that cover ink.
      const size=Math.max(7,em*opt.shard),jit=size*.42*opt.irregularity,x0=pad-size*.5,y0=pad-size*.5,cols=Math.ceil((w+size)/size),rows=Math.ceil((h+size)/size),pts=[];
      for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const edge=i===0||j===0||i===cols||j===rows;pts.push([x0+i*size+(edge?0:rand(-jit,jit)),y0+j*size+(edge?0:rand(-jit,jit))]);}
      const P=(i,j)=>pts[j*(cols+1)+i],tris=[];
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        const a=P(i,j),b2=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);
        if(Math.random()<.5)tris.push([a,b2,c],[a,c,d]);else tris.push([a,b2,d],[b2,c,d]);
      }
      const accent=st.accent;shards=[];
      for(const t of tris){
        const minX=Math.floor(Math.min(t[0][0],t[1][0],t[2][0])),minY=Math.floor(Math.min(t[0][1],t[1][1],t[2][1])),maxX=Math.ceil(Math.max(t[0][0],t[1][0],t[2][0])),maxY=Math.ceil(Math.max(t[0][1],t[1][1],t[2][1]));
        let ink=0;
        for(let y=minY;y<maxY&&!ink;y+=2)for(let x=minX;x<maxX;x+=2){
          if(!inside(t,x,y))continue;
          const px=Math.round(x*dpr),py=Math.round(y*dpr);
          if(px>=0&&py>=0&&px<base.width&&py<base.height&&mask[(py*base.width+px)*4+3]>24){ink=1;break;}
        }
        if(!ink)continue;
        const cx=(t[0][0]+t[1][0]+t[2][0])/3,cy=(t[0][1]+t[1][1]+t[2][1])/3,sw=maxX-minX+2,sh=maxY-minY+2;
        // Front sprite: the ink inside the triangle. Back sprite: the same silhouette in accent, seen while a shard tumbles.
        const front=document.createElement('canvas');front.width=Math.ceil(sw*dpr);front.height=Math.ceil(sh*dpr);
        const f=front.getContext('2d');f.scale(dpr,dpr);f.translate(1-minX,1-minY);tri(f,t);f.clip();f.setTransform(1,0,0,1,0,0);f.drawImage(base,Math.round((1-minX)*dpr),Math.round((1-minY)*dpr));
        const back=document.createElement('canvas');back.width=front.width;back.height=front.height;
        const k=back.getContext('2d');k.drawImage(front,0,0);k.globalCompositeOperation='source-in';k.fillStyle=accent;k.fillRect(0,0,back.width,back.height);
        shards.push({t,cx,cy,front,back,ox:minX-1-cx,oy:minY-1-cy,sign:Math.random()<.5?1:-1,cut:[0,1,2].filter(()=>Math.random()<.4),sw,sh,x:0,y:0,z:0,a:0,b:0,r:0,vx:0,vy:0,vz:0,va:0,vb:0,vr:0,alpha:1,mode:0,release:0,crack:0,flash:0});
      }
      geo={pad,em,dpr,w,h,cw,ch};
      word.classList.add('is-shattering');
      if(!introDone&&visible)assemble();else wake();
    }
    function inside(t,x,y){
      const s=(p,q)=>(q[0]-p[0])*(y-p[1])-(q[1]-p[1])*(x-p[0]),d1=s(t[0],t[1]),d2=s(t[1],t[2]),d3=s(t[2],t[0]);
      return !((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0));
    }
    function tri(c,t){c.beginPath();c.moveTo(t[0][0],t[0][1]);c.lineTo(t[1][0],t[1][1]);c.lineTo(t[2][0],t[2][1]);c.closePath();}
    function assemble(){
      introDone=true;const now=performance.now(),{em,w}=geo;
      for(const s of shards){
        const ang=rand(0,Math.PI*2),dist=rand(.35,1.1)*em*.6;
        Object.assign(s,{x:Math.cos(ang)*dist,y:Math.sin(ang)*dist,z:rand(.4,1.4)*opt.depth,a:rand(-3,3),b:rand(-3,3),r:rand(-1.5,1.5),vx:0,vy:0,vz:0,va:0,vb:0,vr:0,alpha:0,mode:1,crack:0,
          release:now+opt.intro*1000*(.15+.55*((s.cx-geo.pad)/Math.max(1,w))+rand(0,.12))});
      }
      autoplayAt=now+opt.intro*1000+opt.autoplay*1000;wake();
    }
    function shatter(px,py,strength=1){
      const now=performance.now(),{em}=geo,R=opt.shatterRadius*em;
      for(const s of shards){
        const dx=s.cx-px,dy=s.cy-py,d=Math.hypot(dx,dy);
        if(d<R){
          const n=d||1,sp=opt.force*strength*em*rand(2.2,5)*(1-d/R*.45),dir=Math.atan2(dy,dx)+rand(-.5,.5),spin=opt.spin*rand(4,13);
          Object.assign(s,{mode:1,release:now+opt.reassemble*1000*rand(.85,1.15),vx:Math.cos(dir)*sp+dx/n*em*.3,vy:Math.sin(dir)*sp,vz:opt.depth*rand(.8,2.6)*strength,va:spin*rand(-1,1),vb:spin*rand(-1,1),vr:rand(-1,1)*spin*.6,flash:0});
        }else if(d<R*1.35)s.crack=Math.max(s.crack,opt.crack*(1-(d-R)/(R*.35)));
      }
      wake();
    }
    function step(now){
      frame=0;const dt=Math.min(.05,(now-(last||now))/1000);last=now;
      const k=30+230*opt.stiffness,damp=2*Math.sqrt(k)*.72,drag=Math.exp(-2.4*dt),heal=dt/opt.heal;
      let busy=false;
      if(pointer&&geo){
        const r=opt.crackRadius*geo.em;
        for(const s of shards){const d=Math.hypot(s.cx-pointer.x,s.cy-pointer.y);if(d<r)s.crack=Math.max(s.crack,opt.crack*(1-d/r)**1.5);}
      }
      for(const s of shards){
        if(s.mode===1){
          if(now<s.release){s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;s.a+=s.va*dt;s.b+=s.vb*dt;s.r+=s.vr*dt;s.vx*=drag;s.vy*=drag;s.vz*=drag;s.va*=drag;s.vb*=drag;s.vr*=drag;}
          else{s.mode=2;for(const p of ['a','b','r'])s[p]=Math.atan2(Math.sin(s[p]),Math.cos(s[p]));}
        }
        if(s.mode===2){
          for(const [p,v] of [['x','vx'],['y','vy'],['z','vz'],['a','va'],['b','vb'],['r','vr']]){s[v]+=(-k*s[p]-damp*s[v])*dt;s[p]+=s[v]*dt;}
          s.alpha=Math.min(1,s.alpha+dt*2.6);
          if(Math.abs(s.x)+Math.abs(s.y)<.35&&Math.abs(s.z)<.01&&Math.abs(s.a)+Math.abs(s.b)+Math.abs(s.r)<.02&&Math.abs(s.vx)+Math.abs(s.vy)<12){
            Object.assign(s,{x:0,y:0,z:0,a:0,b:0,r:0,vx:0,vy:0,vz:0,va:0,vb:0,vr:0,alpha:1,mode:0,flash:opt.glint});
          }
        }
        if(s.crack>0)s.crack=Math.max(0,s.crack-heal);
        if(s.flash>0)s.flash=Math.max(0,s.flash-dt*2.6);
        if(s.mode||s.crack||s.flash)busy=true;
      }
      if(visible&&opt.autoplay&&!pointer&&introDone&&now>=autoplayAt&&now-lastPointer>opt.autoplay*1000&&shards.length){
        const s=shards[Math.floor(Math.random()*shards.length)];shatter(s.cx,s.cy,.75);autoplayAt=now+opt.autoplay*1000;
      }
      render();
      if(busy||(visible&&(pointer||opt.autoplay)))frame=requestAnimationFrame(step);else last=0;
    }
    function render(){
      if(!geo)return;const {dpr,em}=geo;
      ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(base,0,0);ctx.setTransform(dpr,0,0,dpr,0,0);
      const moving=[];
      for(const s of shards){
        if(s.mode)moving.push(s);
        else if(s.crack>.12)moving.push(s);
      }
      if(!moving.length&&!shards.some(s=>s.flash>.01))return;
      // Punch every displaced shard out of the base in one path, so the untouched glass has no seams.
      ctx.globalCompositeOperation='destination-out';ctx.beginPath();
      for(const s of moving){const t=s.t;ctx.moveTo(t[0][0],t[0][1]);ctx.lineTo(t[1][0],t[1][1]);ctx.lineTo(t[2][0],t[2][1]);ctx.closePath();}
      ctx.fill();ctx.globalCompositeOperation='source-over';
      for(const s of moving){
        let x=s.x,y=s.y,r=s.r;
        if(!s.mode){
          // Hairline crack: lift each piece a hair away from its neighbours and draw the gap.
          const c=s.crack,dx=s.cx-(pointer?.x??s.cx),dy=s.cy-(pointer?.y??s.cy),n=Math.hypot(dx,dy)||1;
          x=dx/n*c*em*.012;y=dy/n*c*em*.012;r=c*.04*s.sign;
        }
        const tiltA=Math.cos(s.a),tiltB=Math.cos(s.b),scale=1+s.z*.35,face=tiltA*tiltB>=0;
        ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,s.alpha*(1-Math.max(0,s.z-1.6)*.6)));
        ctx.translate(s.cx+x,s.cy+y);ctx.rotate(r);ctx.scale(scale*Math.max(.04,Math.abs(tiltA)),scale*Math.max(.04,Math.abs(tiltB)));
        ctx.drawImage(face?s.front:s.back,s.ox,s.oy,s.sw,s.sh);
        const glint=opt.glint*(1-Math.abs(tiltA*tiltB))*(s.mode?1:0);
        if(face&&glint>.02){ctx.globalAlpha*=Math.min(1,glint*.7);ctx.drawImage(s.back,s.ox,s.oy,s.sw,s.sh);}
        if(!s.mode&&s.crack>.05&&s.cut.length){
          // Only some edges of each piece open up, so the fracture reads as cracks rather than a mesh.
          ctx.globalAlpha=Math.min(1,s.crack*1.3);ctx.globalCompositeOperation='destination-out';ctx.lineWidth=Math.max(.7,em*.005);ctx.beginPath();
          for(const i of s.cut){const p=s.t[i],q=s.t[(i+1)%3];ctx.moveTo(p[0]-s.cx,p[1]-s.cy);ctx.lineTo(q[0]-s.cx,q[1]-s.cy);}
          ctx.stroke();ctx.globalCompositeOperation='source-over';
        }
        ctx.restore();
      }
      for(const s of shards)if(!s.mode&&s.flash>.01){ctx.globalAlpha=Math.min(1,s.flash*.8);ctx.drawImage(s.back,s.cx+s.ox,s.cy+s.oy,s.sw,s.sh);}
      ctx.globalAlpha=1;
    }
    function wake(){if(!frame&&geo){last=0;frame=requestAnimationFrame(step);}}
    function local(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*geo.cw/r.width,y:(e.clientY-r.top)*geo.ch/r.height};}
    const onMove=e=>{if(!geo||e.pointerType==='touch')return;pointer=local(e);lastPointer=performance.now();wake();};
    const onLeave=()=>{pointer=null;lastPointer=performance.now();};
    const onDown=e=>{if(!geo)return;const p=local(e);lastPointer=performance.now();autoplayAt=lastPointer+opt.autoplay*1000;shatter(p.x,p.y);};
    function schedule(){clearTimeout(rebuildTimer);rebuildTimer=setTimeout(()=>{if(canvas||!reduced.matches)build();},120);}
    function start(){
      if(observers.length)return;
      word.addEventListener('pointermove',onMove);word.addEventListener('pointerleave',onLeave);word.addEventListener('pointerdown',onDown);
      const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&geo&&!introDone)assemble();if(visible)wake();},{threshold:.35});
      // Rebuild when the language switch rewrites the word or the layout changes size.
      const ro=new ResizeObserver(schedule),mo=new MutationObserver(()=>{if(!word.contains(canvas)&&canvas)word.append(canvas);schedule();});
      io.observe(word);ro.observe(word);mo.observe(word,{childList:true,characterData:true,subtree:true});
      observers=[io,ro,mo];
      (document.fonts?.ready||Promise.resolve()).then(build);
    }
    function teardown(keepListeners){
      cancelAnimationFrame(frame);frame=0;geo=null;shards=[];
      canvas?.remove();canvas=null;ctx=null;base=null;word.classList.remove('is-shattering');
      if(keepListeners)return;
      observers.forEach(o=>o.disconnect());observers=[];
      word.removeEventListener('pointermove',onMove);word.removeEventListener('pointerleave',onLeave);word.removeEventListener('pointerdown',onDown);
    }
    const sync=()=>reduced.matches?teardown():start();
    reduced.addEventListener?.('change',sync);sync();
    // Glass colours are sampled from CSS, so follow a theme change.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',schedule);
  })();
})();
