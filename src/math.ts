import type { Vec3 } from './state.js';
export type Mat4 = Float32Array;
export const sub = (a:Vec3,b:Vec3):Vec3 => [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const add = (a:Vec3,b:Vec3):Vec3 => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const scale = (a:Vec3,n:number):Vec3 => [a[0]*n,a[1]*n,a[2]*n];
export const dot = (a:Vec3,b:Vec3):number=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const cross = (a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const normal = (a:Vec3):Vec3 => scale(a,1/(Math.hypot(...a)||1));
export const identity = ():Mat4=> new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
export function multiply(a:Mat4,b:Mat4):Mat4 {
 const out=new Float32Array(16);
 for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];
 return out;
}
export function compose(pos:Vec3=[0,0,0],rot:Vec3=[0,0,0],size:Vec3=[1,1,1]):Mat4{
 const [x,y,z]=rot,cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);
 const rx=new Float32Array([1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1]);
 const ry=new Float32Array([cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1]);
 const rz=new Float32Array([cz,sz,0,0,-sz,cz,0,0,0,0,1,0,0,0,0,1]);
 const m=multiply(multiply(rz,ry),rx);
 for(let c=0;c<3;c++)for(let r=0;r<3;r++)m[c*4+r]*=size[c];
 m[12]=pos[0];m[13]=pos[1];m[14]=pos[2];return m;
}
export function perspective(fov:number,aspect:number,near=.08,far=100):Mat4 {
 const f=1/Math.tan(fov*Math.PI/360),nf=1/(near-far);
 return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
export function lookAt(eye:Vec3,target:Vec3):Mat4{
 const z=normal(sub(eye,target)),x=normal(cross([0,1,0],z)),y=cross(z,x);
 return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
}
