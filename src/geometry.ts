import type { Vec3 } from './state.js';
import {normal, cross, sub, add, scale} from './math.js';
export type Geometry={vertices:Float32Array;indices:Uint16Array};
export function pathTube(path:(t:number)=>Vec3,radius:number,segments=144,sides=12):Geometry{
 const vertices:number[]=[],indices:number[]=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments*Math.PI*2,p=path(t),tangent=normal(sub(path(t+.001),path(t-.001)));
  let n=normal(cross(tangent,[0,0,1]));if(Math.hypot(...n)<.1)n=normal(cross(tangent,[0,1,0]));
  const b=normal(cross(tangent,n));
  for(let j=0;j<=sides;j++){
   const a=j/sides*Math.PI*2,norm=add(scale(n,Math.cos(a)),scale(b,Math.sin(a))),v=add(p,scale(norm,radius));
   vertices.push(...v,...norm);
   if(i<segments&&j<sides){const k=i*(sides+1)+j;indices.push(k,k+sides+1,k+1,k+1,k+sides+1,k+sides+2)}
  }
 }
 return {vertices:new Float32Array(vertices),indices:new Uint16Array(indices)};
}
export const ring=(r:number,tube:number,segments=120):Geometry=>pathTube(t=>[r*Math.cos(t),r*Math.sin(t),0],tube,segments,12);
export const knot=(r=.52,tube=.28,segments=220,sides=18):Geometry=>pathTube(t=>[r*(2+Math.cos(3*t))*Math.cos(2*t),r*(2+Math.cos(3*t))*Math.sin(2*t),r*Math.sin(3*t)],tube,segments,sides);
export function sphere(radius:number,lat=28,lon=48):Geometry{
 const v:number[]=[],ind:number[]=[];
 for(let i=0;i<=lat;i++)for(let j=0;j<=lon;j++){
  const a=i/lat*Math.PI,b=j/lon*Math.PI*2,n:Vec3=[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];
  v.push(...scale(n,radius),...n);
  if(i<lat&&j<lon){const k=i*(lon+1)+j;ind.push(k,k+1,k+lon+1,k+1,k+lon+2,k+lon+1)}
 }
 return{vertices:new Float32Array(v),indices:new Uint16Array(ind)};
}
export function box(w=1,h=1,d=1):Geometry{
 const v:number[]=[],indices:number[]=[];
 const faces:{n:Vec3;p:Vec3[]}[]=[
  {n:[0,0,1],p:[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]},
  {n:[0,0,-1],p:[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]]},
  {n:[0,1,0],p:[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]},
  {n:[0,-1,0],p:[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]},
  {n:[1,0,0],p:[[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]]},
  {n:[-1,0,0],p:[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]}
 ];
 faces.forEach((f,i)=>{f.p.forEach(p=>v.push(p[0]*w/2,p[1]*h/2,p[2]*d/2,...f.n));const k=i*4;indices.push(k,k+1,k+2,k,k+2,k+3)});
 return{vertices:new Float32Array(v),indices:new Uint16Array(indices)};
}
export function roundedRectPath(w:number,h:number,r:number):(t:number)=>Vec3{
 return(t:number)=>{
  const q=((t/(Math.PI*2)*4)%4+4)%4,k=Math.floor(q),a=(q-k)*Math.PI/2;
  const centres:Vec3[]=[[w/2-r,h/2-r,0],[-w/2+r,h/2-r,0],[-w/2+r,-h/2+r,0],[w/2-r,-h/2+r,0]];
  const start=[0,Math.PI/2,Math.PI,Math.PI*1.5][k];
  return [centres[k][0]+r*Math.cos(a+start),centres[k][1]+r*Math.sin(a+start),0];
 };
}
