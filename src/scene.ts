import type { Geometry } from './geometry.js';
import {buildModel,stationMatrix,localPartMatrix} from './scene-model.js';
import {compose,multiply,lookAt,perspective,type Mat4} from './math.js';
import {meshVertex,meshFragment,pointVertex,pointFragment} from './shaders.js';
import type {CameraPose,Vec3} from './state.js';
type Material={color:Vec3;metal:number;emission:number;alpha?:number};
type GPUShape={vertices:WebGLBuffer;indices:WebGLBuffer;count:number};
type Part={shape:GPUShape;transform:Mat4;material:Material;spin?:Vec3;bob?:number;mode?:boolean};
export type Scene={render:(pose:CameraPose,time:number,pointer:Vec3)=>void;resize:()=>void;dispose:()=>void;setMode:(mode:string)=>void};
const silver:Material={color:[.7,.78,.85],metal:1,emission:0};
const dark:Material={color:[.045,.07,.10],metal:.65,emission:0};
const cyan:Material={color:[.18,.86,.76],metal:.25,emission:.7};
const amber:Material={color:[1,.49,.15],metal:.3,emission:.7};
/** A small purpose-built WebGL renderer. No external runtime or texture downloads. */
export function createScene(canvas:HTMLCanvasElement):Scene{
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance',premultipliedAlpha:false});
 if(!gl)throw new Error('WebGL unavailable');
 const buffers:WebGLBuffer[]=[],programs:WebGLProgram[]=[],shapes=new Map<string,GPUShape>();
 function shader(type:number,source:string):WebGLShader{
  const s=gl!.createShader(type);if(!s)throw new Error('Shader allocation failed');
  gl!.shaderSource(s,source);gl!.compileShader(s);
  if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS)){const msg=gl!.getShaderInfoLog(s);gl!.deleteShader(s);throw new Error(msg||'Shader compile failed')};return s;
 }
 function program(v:string,f:string):WebGLProgram{
  const p=gl!.createProgram();if(!p)throw new Error('Program allocation failed');
  const vs=shader(gl!.VERTEX_SHADER,v),fs=shader(gl!.FRAGMENT_SHADER,f);
  gl!.attachShader(p,vs);gl!.attachShader(p,fs);gl!.linkProgram(p);gl!.deleteShader(vs);gl!.deleteShader(fs);
  if(!gl!.getProgramParameter(p,gl!.LINK_STATUS))throw new Error(gl!.getProgramInfoLog(p)||'Link failed');programs.push(p);return p;
 }
 function upload(key:string,g:()=>Geometry):GPUShape{
  const found=shapes.get(key);if(found)return found;
  const geometry=g(),v=gl!.createBuffer(),i=gl!.createBuffer();if(!v||!i)throw new Error('Buffer allocation failed');
  gl!.bindBuffer(gl!.ARRAY_BUFFER,v);gl!.bufferData(gl!.ARRAY_BUFFER,geometry.vertices,gl!.STATIC_DRAW);
  gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER,i);gl!.bufferData(gl!.ELEMENT_ARRAY_BUFFER,geometry.indices,gl!.STATIC_DRAW);
  buffers.push(v,i);const s={vertices:v,indices:i,count:geometry.indices.length};shapes.set(key,s);return s;
 }
 const prog=program(meshVertex,meshFragment),points=program(pointVertex,pointFragment);
 const loc=(name:string)=>gl.getUniformLocation(prog,name);
 const U={model:loc('uModel'),view:loc('uView'),projection:loc('uProjection'),eye:loc('uEye'),color:loc('uColor'),metal:loc('uMetal'),emission:loc('uEmission'),alpha:loc('uAlpha'),time:loc('uTime')};
 const AP=gl.getAttribLocation(prog,'aPosition'),AN=gl.getAttribLocation(prog,'aNormal');
 const PL={view:gl.getUniformLocation(points,'uView'),projection:gl.getUniformLocation(points,'uProjection'),size:gl.getUniformLocation(points,'uSize'),color:gl.getUniformLocation(points,'uColor'),opacity:gl.getUniformLocation(points,'uOpacity')};
 const PP=gl.getAttribLocation(points,'aPosition');
 const stations:Part[][]=buildModel('high').map(station=>station.map(item=>({...item,shape:upload(item.key,()=>item.geometry)})));
 // Spatial dust, seeded once; no random movement or re-seeding on scroll.
 let seed=2026;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const dust:number[]=[];for(let i=0;i<430;i++)dust.push((rand()-.5)*18,(rand()-.5)*11,-rand()*85+6);
 const dustBuffer=gl.createBuffer(),glowBuffer=gl.createBuffer();if(!dustBuffer||!glowBuffer)throw new Error('Point allocation failed');
 buffers.push(dustBuffer,glowBuffer);gl.bindBuffer(gl.ARRAY_BUFFER,dustBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(dust),gl.STATIC_DRAW);
 let width=0,height=0,mobile=false,mode='idle',disposed=false;
 function resize(){mobile=innerWidth<760;const dpr=Math.min(devicePixelRatio||1,mobile?1:1.35);width=Math.round(canvas.clientWidth*dpr);height=Math.round(canvas.clientHeight*dpr);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}gl!.viewport(0,0,width,height)}
 function drawPoints(view:Mat4,projection:Mat4,buffer:WebGLBuffer,count:number,size:number,color:Vec3,opacity:number){
  gl!.useProgram(points);gl!.uniformMatrix4fv(PL.view,false,view);gl!.uniformMatrix4fv(PL.projection,false,projection);
  gl!.uniform1f(PL.size,size);gl!.uniform3fv(PL.color,color);gl!.uniform1f(PL.opacity,opacity);
  gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer);gl!.enableVertexAttribArray(PP);gl!.vertexAttribPointer(PP,3,gl!.FLOAT,false,12,0);
  gl!.drawArrays(gl!.POINTS,0,count);
 }
 function render(pose:CameraPose,time:number,pointer:Vec3){
  if(disposed||gl!.isContextLost())return;
  if(width===0||height===0)resize();
  const eye:Vec3=[pose.position[0]+(mobile?1.65:0)+pointer[0]*.10,pose.position[1]+(mobile?1.25:0)+pointer[1]*.07,pose.position[2]];
  const target:Vec3=[pose.target[0]+(mobile?1.65:0),pose.target[1]+(mobile?1.25:0),pose.target[2]];
  const view=lookAt(eye,target),projection=perspective(mobile?54:pose.fov,width/height);
  gl!.clearColor(0,0,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);
  gl!.enable(gl!.DEPTH_TEST);gl!.disable(gl!.CULL_FACE);gl!.enable(gl!.BLEND);gl!.blendFunc(gl!.SRC_ALPHA,gl!.ONE_MINUS_SRC_ALPHA);
  // Diffuse glow behind each station, not an image or screenshot texture.
  gl!.depthMask(false);gl!.blendFunc(gl!.SRC_ALPHA,gl!.ONE);
  drawPoints(view,projection,dustBuffer!,dust.length/3,.095,[.43,.63,.69],.58);
  for(let s=0;s<5;s++){
   if(Math.abs(s-pose.station)>1.15)continue;
   gl!.bindBuffer(gl!.ARRAY_BUFFER,glowBuffer);gl!.bufferData(gl!.ARRAY_BUFFER,new Float32Array([1.65,0,-s*16-.8]),gl!.DYNAMIC_DRAW);
   drawPoints(view,projection,glowBuffer!,1,mobile?13:18,s===3?[.1,.11,.22]:[.07,.18,.21],.40);
  }
  gl!.depthMask(true);gl!.blendFunc(gl!.SRC_ALPHA,gl!.ONE_MINUS_SRC_ALPHA);gl!.useProgram(prog);
  gl!.uniformMatrix4fv(U.view,false,view);gl!.uniformMatrix4fv(U.projection,false,projection);gl!.uniform3fv(U.eye,eye);gl!.uniform1f(U.time,time);
  for(let s=0;s<5;s++){
   if(Math.abs(s-pose.station)>1.3)continue;
   const parent=stationMatrix(s,time);
   for(const item of stations[s]){
    const model=multiply(parent,localPartMatrix(item,time,mode));
    gl!.uniformMatrix4fv(U.model,false,model);gl!.uniform3fv(U.color,item.material.color);
    gl!.uniform1f(U.metal,item.material.metal);gl!.uniform1f(U.emission,item.material.emission*(item.mode&&mode==='voice'?1.4:1));gl!.uniform1f(U.alpha,item.material.alpha??1);
    gl!.bindBuffer(gl!.ARRAY_BUFFER,item.shape.vertices);gl!.enableVertexAttribArray(AP);gl!.enableVertexAttribArray(AN);
    gl!.vertexAttribPointer(AP,3,gl!.FLOAT,false,24,0);gl!.vertexAttribPointer(AN,3,gl!.FLOAT,false,24,12);
    gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER,item.shape.indices);gl!.drawElements(gl!.TRIANGLES,item.shape.count,gl!.UNSIGNED_SHORT,0);
   }
  }
  canvas.dataset.cameraZ=eye[2].toFixed(4);canvas.dataset.station=pose.station.toFixed(4);
 }
 resize();return{render,resize,setMode:value=>{mode=value},dispose:()=>{disposed=true;buffers.forEach(b=>gl.deleteBuffer(b));programs.forEach(p=>gl.deleteProgram(p))}};
}
