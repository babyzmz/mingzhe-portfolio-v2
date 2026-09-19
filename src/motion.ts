import {createScene,type Scene} from './scene.js';
import {createSoftwareScene} from './software-scene.js';
import {sampleCamera,heldProgress,clamp,type Vec3} from './state.js';
import {attachGsap,type ScrollAdapter} from './gsap-adapter.js';
export type MotionController={refresh:()=>void;setPaused:(v:boolean)=>void;setSuspended:(v:boolean)=>void;setMode:(s:string)=>void;dispose:()=>void};
export function createMotion(canvas:HTMLCanvasElement,initialPaused:boolean,onRenderer:(mode:'webgl'|'software-3d'|'static')=>void):MotionController{
 let scene:Scene|null=null,adapter:ScrollAdapter|null=null,anchors:number[]=[0,1000,2000,3000,4000],workTop=7000,aboutTop=9500;
 let paused=initialPaused,stopped=false,suspended=false,raf=0,previous=0,time=0,inputY=scrollY,current=0,dirty=true,backend='native';
 let pointer:Vec3=[0,0,0],smoothPointer:Vec3=[0,0,0];
 const root=document.documentElement;
 function initialise(){try{scene=createScene(canvas);root.dataset.renderer='webgl';onRenderer('webgl')}catch(error){canvas.dataset.renderReason=error instanceof Error?error.message:'WebGL unavailable';try{scene=createSoftwareScene(canvas);root.dataset.renderer='software-3d';onRenderer('software-3d')}catch{scene=null;root.dataset.renderer='static';onRenderer('static')}}}
 function updatePage(){
  const y=scrollY;document.body.classList.toggle('outside-story',y>workTop-75);
  root.dataset.surface=y>workTop-90&&y<aboutTop-90?'light':'dark';
  const active=Math.min(4,Math.round(heldProgress(y,anchors)));
  document.querySelectorAll<HTMLAnchorElement>('[data-rail]').forEach(a=>{const on=Number(a.dataset.rail)===active;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});
 }
 function schedule(){dirty=true;if(!raf&&!stopped&&!suspended&&!document.hidden)raf=requestAnimationFrame(frame)}
 function frame(now:number){
  raf=0;if(stopped||suspended||document.hidden)return;
  const dt=Math.min(.06,previous?(now-previous)/1000:.016);previous=now;
  const target=heldProgress(inputY,anchors);
  current=paused?Math.round(target):current+(target-current)*(1-Math.exp(-dt*11));
  if(Math.abs(current-target)<.0001&&!paused)current=target;
  if(!paused)time+=dt;
  smoothPointer=smoothPointer.map((v,i)=>v+(pointer[i]-v)*.07) as Vec3;
  if(scene&&(dirty||(!paused&&scrollY<workTop+50))){scene.render(sampleCamera(current),time,paused?[0,0,0]:smoothPointer);dirty=false}
  if((!paused&&scrollY<workTop+50)||Math.abs(current-target)>.001&&!paused)schedule();
 }
 function refresh(){
  anchors=Array.from(document.querySelectorAll<HTMLElement>('[data-scene]')).map(el=>el.getBoundingClientRect().top+scrollY);
  workTop=(document.querySelector('#work')?.getBoundingClientRect().top??7000)+scrollY;
  aboutTop=(document.querySelector('#about')?.getBoundingClientRect().top??9500)+scrollY;
  if(backend==='native')inputY=scrollY;
  scene?.resize();adapter?.refresh();updatePage();schedule();
 }
 const onScroll=()=>{if(backend==='native')inputY=scrollY;updatePage();schedule()};
 const onResize=()=>refresh();
 const onPointer=(e:PointerEvent)=>{if(e.pointerType==='mouse'&&!paused&&!suspended&&innerWidth>=760){pointer=[(e.clientX/innerWidth-.5)*2,-(e.clientY/innerHeight-.5)*2,0];schedule()}};
 const onVisibility=()=>{previous=0;if(document.hidden){cancelAnimationFrame(raf);raf=0}else{refresh();schedule()}};
 const onLost=(event:Event)=>{event.preventDefault();root.dataset.renderer='static';onRenderer('static');scene?.dispose();scene=null;cancelAnimationFrame(raf);raf=0};
 const onRestore=()=>{initialise();refresh()};
 initialise();refresh();current=paused?Math.round(heldProgress(scrollY,anchors)):heldProgress(scrollY,anchors);
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onResize,{passive:true});window.addEventListener('pointermove',onPointer,{passive:true});document.addEventListener('visibilitychange',onVisibility);
 canvas.addEventListener('webglcontextlost',onLost);canvas.addEventListener('webglcontextrestored',onRestore);
 root.dataset.scrollBackend='native';
 // The offline edition deliberately uses the real native backend. Successful
 // installed GSAP attachment takes over progress; there are never two writers.
 attachGsap(y=>{if(backend==='gsap'){inputY=y;schedule()}},()=>anchors.at(-1)||1).then(value=>{
  if(stopped){value?.dispose();return}if(value){adapter=value;backend='gsap';root.dataset.scrollBackend='gsap';adapter.refresh()}
 });
 return{refresh,setSuspended:value=>{suspended=value;previous=0;if(value){cancelAnimationFrame(raf);raf=0}else if(!stopped){refresh();schedule()}},setPaused:value=>{paused=value;previous=0;inputY=scrollY;schedule()},setMode:value=>{scene?.setMode(value);schedule()},dispose:()=>{
  stopped=true;cancelAnimationFrame(raf);adapter?.dispose();scene?.dispose();window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onResize);window.removeEventListener('pointermove',onPointer);document.removeEventListener('visibilitychange',onVisibility);canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestore);
 }};
}
