import {atmosphereVertex, pillarFragment, veilFragment} from './atmosphere-shaders.js';
export type Atmosphere = {refresh:()=>void;setPaused:()=>void;setSuspended:(v:boolean)=>void;dispose:()=>void};
type Program = {program:WebGLProgram;position:number;uniform:(key:string)=>WebGLUniformLocation|null};
/** One additional WebGL context, shared between mutually exclusive page regions. */
export function createAtmosphere(reduced:()=>boolean):Atmosphere {
 const host=document.querySelector<HTMLElement>('#atmosphere')!;
 const canvas=host.querySelector<HTMLCanvasElement>('canvas')!;
 const root=document.documentElement;
 let gl:WebGLRenderingContext|null=null,triangle:WebGLBuffer|null=null;
 let programs:Program[]=[],raf=0,last=0,time=1.2,draws=0,dirty=true;
 let suspended=false,disposed=false,lost=false,hidden=document.hidden;
 let work=0,about=0,end=0,width=0,height=0,small=false,mode='none';
 let currentOpacity=-1,clip='';
 const windowHeight=()=>document.documentElement.clientHeight || innerHeight;
 function compile(type:number,source:string){
  const shader=gl!.createShader(type);if(!shader)throw Error('Shader allocation');
  gl!.shaderSource(shader,source);gl!.compileShader(shader);
  if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)){const error=gl!.getShaderInfoLog(shader);gl!.deleteShader(shader);throw Error(error||'Shader compilation')}
  return shader;
 }
 function program(fragment:string):Program{
  const p=gl!.createProgram();if(!p)throw Error('Program allocation');
  let v:WebGLShader|null=null,f:WebGLShader|null=null;
  try{v=compile(gl!.VERTEX_SHADER,atmosphereVertex);f=compile(gl!.FRAGMENT_SHADER,fragment);gl!.attachShader(p,v);gl!.attachShader(p,f);gl!.linkProgram(p);
   if(!gl!.getProgramParameter(p,gl!.LINK_STATUS))throw Error(gl!.getProgramInfoLog(p)||'Shader linking');
  }catch(e){gl!.deleteProgram(p);throw e}finally{if(v)gl!.deleteShader(v);if(f)gl!.deleteShader(f)}
  const cache=new Map<string,WebGLUniformLocation|null>();
  return {program:p,position:gl!.getAttribLocation(p,'position'),uniform:key=>{if(!cache.has(key))cache.set(key,gl!.getUniformLocation(p,key));return cache.get(key)!}};
 }
 function cleanup(){if(gl){for(const p of programs)gl.deleteProgram(p.program);if(triangle)gl.deleteBuffer(triangle)}programs=[];triangle=null}
 function initialise(){
  try{
   gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
   if(!gl)throw Error('WebGL unavailable');
   programs.push(program(pillarFragment));programs.push(program(veilFragment));
   triangle=gl.createBuffer();if(!triangle)throw Error('Buffer allocation');
   gl.bindBuffer(gl.ARRAY_BUFFER,triangle);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
   host.dataset.backend='webgl';
  }catch(error){cleanup();gl=null;host.dataset.backend='css';host.dataset.reason=error instanceof Error?error.message:'Background unavailable'}
 }
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;host.dataset.running='false'}
 function setGlobalState(){root.dataset.ambientMotion=reduced()||suspended||hidden?'paused':'running'}
 function updateRegion(){
  const y=scrollY,h=windowHeight();let next='none',top=0,bottom=0,opacity=1;
  if(y<work){next='pillar';bottom=Math.max(0,h-(work-y));opacity=Math.min(1,Math.max(0,(work-y)/Math.min(240,h*.4)))}
  else if(y+h>about&&y<end){next='veil';top=Math.max(0,about-y);bottom=Math.max(0,y+h-end)}
  if(mode!==next){mode=next;host.dataset.effect=mode;dirty=true}
  const nextClip=`inset(${top}px 0 ${bottom}px 0)`;
  if(clip!==nextClip){clip=nextClip;host.style.clipPath=clip}
  if(currentOpacity!==opacity){host.style.opacity=String(opacity);currentOpacity=opacity}
  host.style.visibility=mode==='none'?'hidden':'visible';
 }
 function resize(){
  small=innerWidth<760;
  const w=canvas.clientWidth,h=canvas.clientHeight;
  // Backgrounds are intentionally lower resolution than the foreground models.
  const scale=Math.min(small?.45:.60,960/Math.max(1,w),640/Math.max(1,h));
  width=Math.max(1,Math.round(w*scale));height=Math.max(1,Math.round(h*scale));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;dirty=true}
 }
 function render(){
  if(!gl||lost||programs.length!==2||!width||!height)return;
  const pillar=mode==='pillar',p=programs[pillar?0:1];gl.viewport(0,0,width,height);gl.useProgram(p.program);
  gl.bindBuffer(gl.ARRAY_BUFFER,triangle);gl.enableVertexAttribArray(p.position);gl.vertexAttribPointer(p.position,2,gl.FLOAT,false,0,0);
  const f=(k:string,v:number)=>gl!.uniform1f(p.uniform(k),v);
  gl.uniform2f(p.uniform('uResolution'),width,height);
  f('uTime',time);f('uLightMode',0);
  if(pillar){
   f('uCenter',small?.72:.73);f('uOpacity',small?.46:.72);
   gl.uniform3f(p.uniform('uTopColor'),.28,.69,.73);gl.uniform3f(p.uniform('uBottomColor'),.15,.26,.57);
   f('uIntensity',.8);f('uGlowAmount',.0055);f('uPillarWidth',2.7);f('uPillarHeight',.36);f('uNoiseIntensity',.16);
   gl.uniform1i(p.uniform('uLowQuality'),small?1:0);gl.uniform1i(p.uniform('uInteractive'),0);gl.uniform2f(p.uniform('uMouse'),0,0);
   f('uRotCos',Math.cos(time*.3));f('uRotSin',Math.sin(time*.3));
   f('uPillarRotCos',Math.cos(-.1));f('uPillarRotSin',Math.sin(-.1));f('uWaveCos',Math.cos(.4));f('uWaveSin',Math.sin(.4));
  }else{f('uOpacity',.56);f('uHueShift',16);f('uNoise',.015);f('uScan',.03);f('uScanFreq',.8);f('uWarp',.14)}
  gl.drawArrays(gl.TRIANGLES,0,3);canvas.dataset.frames=String(++draws);canvas.dataset.time=time.toFixed(4);dirty=false;
 }
 function tick(now:number){
  raf=0;if(disposed||suspended||hidden||mode==='none'||lost)return;
  const interval=1000/(small?24:30);
  if(dirty||!last||now-last>=interval){
   const dt=last?Math.min((now-last)/1000,.10):0;
   if(!reduced())time+=dt*(mode==='pillar'?.28:.34);
   render();last=now;
  }
  if(gl&&!reduced()) {host.dataset.running='true';raf=requestAnimationFrame(tick)}else host.dataset.running='false';
 }
 function schedule(){setGlobalState();if(disposed||suspended||hidden||mode==='none'||lost||!gl){stop();return}if(!raf&&(dirty||!reduced()))raf=requestAnimationFrame(tick)}
 function refresh(){
  if(disposed)return;
  const position=(selector:string,fallback:number)=>{const e=document.querySelector(selector);return e?e.getBoundingClientRect().top+scrollY:fallback};
  work=position('#work',7000);about=position('#about',9500);end=document.documentElement.scrollHeight;
  resize();updateRegion();schedule();
 }
 const scroll=()=>{updateRegion();schedule()};
 const visibility=()=>{hidden=document.hidden;stop();schedule()};
 const loss=(event:Event)=>{event.preventDefault();lost=true;stop();host.dataset.backend='css';host.dataset.reason='WebGL context lost'};
 const restore=()=>{lost=false;cleanup();initialise();dirty=true;refresh()};
 window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',refresh,{passive:true});
 document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',loss);canvas.addEventListener('webglcontextrestored',restore);
 initialise();refresh();
 return {refresh,setPaused:()=>{dirty=true;stop();schedule()},setSuspended:value=>{suspended=value;stop();schedule()},dispose:()=>{
  disposed=true;stop();cleanup();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',refresh);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',loss);canvas.removeEventListener('webglcontextrestored',restore);root.dataset.ambientMotion='paused';
 }};
}
