import {buildModel,stationMatrix,localPartMatrix,type Material} from './scene-model.js';
import {multiply,lookAt,perspective,normal,dot,type Mat4} from './math.js';
import type {Vec3,CameraPose} from './state.js';
import type {Scene} from './scene.js';
type Colour={r:number;g:number;b:number;a:number;l:number};
type Projected={x:number;y:number;depth:number;world:Vec3;normal:Vec3;color:Colour};
type Triangle={p:Projected[];depth:number};
const clamp01=(v:number)=>Math.min(1,Math.max(0,v));
const sm=(a:number,b:number,v:number)=>{const t=clamp01((v-a)/(b-a));return t*t*(3-2*t)};
const light1=normal([-.4,.75,1]),light2=normal([.8,.1,.6]),light3=normal([0,-.8,.7]);
/** Canvas 2D triangle rasterization of the same true 3D meshes and camera.
 * Used on browsers that do not expose WebGL. It is labelled SOFTWARE 3D.
 * No screenshot textures, fake depth transitions or external dependencies.
 */
export function createSoftwareScene(canvas:HTMLCanvasElement):Scene{
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw new Error('Canvas fallback unavailable');
 const stations=buildModel('low');let width=0,height=0,mobile=false,mode='idle',disposed=false;
 const transform=(m:Mat4,p:Vec3,w=1):Vec3=>[m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12]*w,m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13]*w,m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]*w];
 function resize(){width=Math.round(canvas.clientWidth);height=Math.round(canvas.clientHeight);mobile=width<760;canvas.width=width;canvas.height=height;}
 function project(p:Vec3,view:Mat4,projection:Mat4):{x:number;y:number;depth:number}{
  const v=transform(view,p);return{x:(v[0]*projection[0]/-v[2]*.5+.5)*width,y:(.5-v[1]*projection[5]/-v[2]*.5)*height,depth:-v[2]};
 }
 function shade(n:Vec3,v:Vec3,mat:Material,depth:number):Colour{
  const nv=dot(n,v);const fres=Math.pow(1-Math.max(nv,0),3);
  const r:Vec3=[2*nv*n[0]-v[0],2*nv*n[1]-v[1],2*nv*n[2]-v[2]];
  const sky=sm(-.5,.9,r[1]),key=Math.pow(Math.max(dot(r,light1),0),50),fill=Math.pow(Math.max(dot(r,light2),0),15);
  const strip=Math.exp(-Math.pow((r[0]+.36)*14,2))*sm(-.45,-.12,r[1])*sm(.3,.5,r[2]);
  const long=Math.exp(-Math.pow((r[1]-.48)*22,2))*sm(-.7,-.15,r[0]);
  const low=Math.pow(Math.max(dot(r,light3),0),10),diff=Math.max(dot(n,normal([-.4,.8,1.2])),0);
  const env=[.012+sky*.158+1.9*key+.55*fill+1.5*strip+1.2*long+.045*low,.018+sky*.192+2*key+.76*fill+1.55*strip+1.3*long+.2*low,.035+sky*.235+2.2*key+.81*fill+1.6*strip+1.38*long+.18*low];
  const emission=mat.emission;const rgb=env.map((value,i)=>{const base=mat.color[i]*(.12+.42*diff),metal=value*(.7+.8*fres)*(.78+mat.color[i]*.22);let c=base*(1-mat.metal)+metal*mat.metal+mat.color[i]*emission+[.025,.05,.065][i]*fres;c=c/(1+c*.32);return Math.round(Math.min(255,Math.pow(Math.max(0,c),.82)*255))});
  return {r:rgb[0],g:rgb[1],b:rgb[2],a:(mat.alpha??1)*(1-sm(14,25,depth)),l:rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
 }
 let seed=2026;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const dust:Vec3[]=Array.from({length:210},()=>[(rand()-.5)*18,(rand()-.5)*11,-rand()*85+6]);
 function render(pose:CameraPose,time:number,pointer:Vec3){
  if(disposed||!width||!height)return;
  const eye:Vec3=[pose.position[0]+(mobile?1.65:0)+pointer[0]*.1,pose.position[1]+(mobile?1.25:0)+pointer[1]*.07,pose.position[2]];
  const target:Vec3=[pose.target[0]+(mobile?1.65:0),pose.target[1]+(mobile?1.25:0),pose.target[2]];
  const view=lookAt(eye,target),projection=perspective(mobile?54:pose.fov,width/height);
  ctx!.clearRect(0,0,width,height);
  for(const point of dust){const p=project(point,view,projection);if(p.depth<.2||p.depth>23)continue;ctx!.fillStyle=`rgba(110,166,168,${.28*(1-p.depth/24)})`;ctx!.fillRect(p.x,p.y,.8,.8)}
  const triangles:Triangle[]=[];
  for(let s=0;s<stations.length;s++){
   if(Math.abs(s-pose.station)>1.3)continue;
   const glow=project([1.65,0,-16*s],view,projection);
   if(glow.depth>.3&&glow.depth<18){
    const radius=Math.min(width,1800/glow.depth),gradient=ctx!.createRadialGradient(glow.x,glow.y,0,glow.x,glow.y,radius);
    gradient.addColorStop(0,'rgba(36,89,94,.16)');gradient.addColorStop(.5,'rgba(22,69,79,.05)');gradient.addColorStop(1,'rgba(10,25,30,0)');ctx!.fillStyle=gradient;ctx!.fillRect(glow.x-radius,glow.y-radius,radius*2,radius*2);
   }
   const parent=stationMatrix(s,time);
   for(const part of stations[s]){
    const model=multiply(parent,localPartMatrix(part,time,mode)),source=part.geometry.vertices,indices=part.geometry.indices;
    const vertices:Projected[]=[];
    const material=part.mode&&mode==='voice'?{...part.material,emission:part.material.emission*1.4}:part.material;
    for(let i=0;i<source.length;i+=6){
     const world=transform(model,[source[i],source[i+1],source[i+2]]),n=normal(transform(model,[source[i+3],source[i+4],source[i+5]],0));
     const screen=project(world,view,projection),towards=normal([eye[0]-world[0],eye[1]-world[1],eye[2]-world[2]]);
     vertices.push({...screen,world,normal:n,color:shade(n,towards,material,screen.depth)});
    }
    for(let i=0;i<indices.length;i+=3){
     const a=vertices[indices[i]],b=vertices[indices[i+1]],c=vertices[indices[i+2]];
     if(a.depth<.2||b.depth<.2||c.depth<.2||a.depth>25||b.depth>25||c.depth>25)continue;
     if(Math.max(a.x,b.x,c.x)<0||Math.min(a.x,b.x,c.x)>width||Math.max(a.y,b.y,c.y)<0||Math.min(a.y,b.y,c.y)>height)continue;
     const centre:Vec3=[(a.world[0]+b.world[0]+c.world[0])/3,(a.world[1]+b.world[1]+c.world[1])/3,(a.world[2]+b.world[2]+c.world[2])/3];
     const n=normal([a.normal[0]+b.normal[0]+c.normal[0],a.normal[1]+b.normal[1]+c.normal[1],a.normal[2]+b.normal[2]+c.normal[2]]);
     const v=normal([eye[0]-centre[0],eye[1]-centre[1],eye[2]-centre[2]]);
     if(dot(n,v)<-.01)continue;
     const depth=(a.depth+b.depth+c.depth)/3;
     triangles.push({p:[a,b,c],depth});
    }
   }
  }
  triangles.sort((a,b)=>b.depth-a.depth);
  for(const tri of triangles){
   const [a,b,c]=tri.p,cx=(a.x+b.x+c.x)/3,cy=(a.y+b.y+c.y)/3;
   // Subpixel edge expansion avoids seams between adjacent antialiased triangles.
   const expand=(p:Projected)=>{const dx=p.x-cx,dy=p.y-cy,k=.34/(Math.hypot(dx,dy)||1);return[p.x+dx*k,p.y+dy*k]};
   const aa=expand(a),bb=expand(b),cc=expand(c);
   const rgb=(c:Colour)=>`rgba(${c.r},${c.g},${c.b},${c.a.toFixed(3)})`;
   const det=(b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);
   let paint:string|CanvasGradient=rgb(a.color);
   if(Math.abs(det)>.005){
    const gx=((b.color.l-a.color.l)*(c.y-a.y)-(c.color.l-a.color.l)*(b.y-a.y))/det;
    const gy=((b.x-a.x)*(c.color.l-a.color.l)-(c.x-a.x)*(b.color.l-a.color.l))/det;
    const sorted=[a,b,c].sort((x,y)=>x.color.l-y.color.l),lo=sorted[0],hi=sorted[2],mag=gx*gx+gy*gy;
    if(mag>.0001&&hi.color.l-lo.color.l>2){
     const k=(hi.color.l-lo.color.l)/mag;
     const gradient=ctx!.createLinearGradient(lo.x,lo.y,lo.x+gx*k,lo.y+gy*k);
     gradient.addColorStop(0,rgb(lo.color));gradient.addColorStop(1,rgb(hi.color));paint=gradient;
    }
   }
   ctx!.beginPath();ctx!.moveTo(aa[0],aa[1]);ctx!.lineTo(bb[0],bb[1]);ctx!.lineTo(cc[0],cc[1]);ctx!.closePath();ctx!.fillStyle=paint;ctx!.fill();
  }
  canvas.dataset.cameraZ=eye[2].toFixed(4);canvas.dataset.station=pose.station.toFixed(4);
 }
 resize();return{render,resize,setMode:v=>{mode=v},dispose:()=>{disposed=true}};
}
