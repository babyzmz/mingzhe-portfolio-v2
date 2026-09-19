import {box,ring as baseRing,knot as baseKnot,sphere as baseSphere,pathTube as baseTube,roundedRectPath,type Geometry} from './geometry.js';
import {compose,multiply,type Mat4} from './math.js';
import type {Vec3} from './state.js';
export type Material={color:Vec3;metal:number;emission:number;alpha?:number};
export type ModelPart={key:string;geometry:Geometry;transform:Mat4;material:Material;spin?:Vec3;bob?:number;mode?:boolean};
const silver:Material={color:[.7,.78,.85],metal:1,emission:0};
const dark:Material={color:[.045,.07,.10],metal:.65,emission:0};
const cyan:Material={color:[.18,.86,.76],metal:.25,emission:.7};
const amber:Material={color:[1,.49,.15],metal:.3,emission:.7};
export function buildModel(detail:'high'|'low'='high'):ModelPart[][]{
 const low=detail==='low';
 const ring=(r:number,t:number,s=120)=>baseRing(r,t,low?Math.min(s,60):s);
 const knot=(r=.52,t=.28)=>baseKnot(r,t,low?120:220,low?12:18);
 const sphere=(r:number,a=28,b=48)=>baseSphere(r,low?Math.min(a,16):a,low?Math.min(b,24):b);
 const pathTube=(p:(t:number)=>Vec3,r:number,s=144,n=12)=>baseTube(p,r,low?Math.min(s,64):s,low?Math.min(n,6):n);
 const cache=new Map<string,Geometry>();
 const geometry=(key:string,make:()=>Geometry)=>{if(!cache.has(key))cache.set(key,make());return cache.get(key)!};
 const stations:ModelPart[][]=[[],[],[],[],[]];
 const part=(station:number,key:string,g:()=>Geometry,pos:Vec3,rot:Vec3,size:Vec3,material:Material,extra:Partial<ModelPart>={})=>stations[station].push({key,geometry:geometry(key,g),transform:compose(pos,rot,size),material,...extra});
 const unit:Vec3=[1,1,1],zero:Vec3=[0,0,0];
 // 00 — reflective continuous toroidal sculpture, an original visual metaphor.
 part(0,'knot',()=>knot(),zero,[.38,-.5,-.48],unit,silver,{spin:[.025,.07,.015]});
 part(0,'hero-orbit',()=>ring(2.04,.012),zero,[.6,.3,-.5],unit,{...cyan,emission:.25},{spin:[.01,.025,0]});
 part(0,'core-bead',()=>sphere(.29),zero,zero,unit,{color:[.12,.34,.34],metal:1,emission:.06});
 part(0,'trace',()=>ring(.5,.016),[0,0,.04],[.2,.1,0],unit,cyan,{spin:[.1,.08,.03]});
 // 01 — optical eye; an interpretation, not a native-app screenshot.
 part(1,'eye-shell',()=>ring(1.35,.24),zero,[.06,.14,0],unit,silver,{spin:[.008,.012,.007]});
 part(1,'eye-inner',()=>ring(1.07,.035),[0,0,.08],zero,unit,cyan,{mode:true});
 part(1,'eye-disc',()=>sphere(1.04),[0,0,-.08],zero,[1,1,.27],dark);
 part(1,'iris-outer',()=>ring(.64,.021),[0,0,.26],zero,unit,cyan,{mode:true});
 part(1,'iris',()=>sphere(.43),[0,0,.26],zero,[1,1,.38],{color:[.03,.15,.18],metal:1,emission:.12});
 part(1,'pupil-ring',()=>ring(.235,.05),[0,0,.42],zero,unit,cyan,{mode:true});
 for(let i=0;i<48;i++){
  const a=i/48*Math.PI*2,r=1.7;
  part(1,'tick',()=>box(.012,.073,.018),[Math.cos(a)*r,Math.sin(a)*r,-.05],[0,0,a-Math.PI/2],unit,i%4===0?cyan:{color:[.2,.3,.36],metal:.3,emission:.08});
 }
 part(1,'outer-eye-orbit',()=>ring(1.95,.009),zero,[.3,-.13,0],unit,{...cyan,emission:.1},{spin:[.012,-.025,.012]});
 // 02 — exploded runtime layers and signal traces.
 for(let i=0;i<4;i++){
  const y=(i-1.5)*.72,mat=i===1?silver:dark;
  part(2,'core-board',()=>box(2.3,.07,1.55),[0,y,0],zero,unit,mat);
  part(2,'board-trim',()=>pathTube(roundedRectPath(2.29,1.54,.13),.012,100,6),[0,y+.042,0],[Math.PI/2,0,0],unit,i===2?amber:cyan);
  for(let j=0;j<4;j++){
   part(2,'chip',()=>box(.24,.08,.19),[-.65+j*.43,y+.085,.2],zero,unit,j===1?cyan:silver);
   part(2,'trace-line',()=>box(.008,.009,.78),[-.65+j*.43,y+.045,-.14],zero,unit,{...cyan,emission:.1});
  }
 }
 for(const x of [-.93,.93])part(2,'vertical-signal',()=>box(.008,2.42,.008),[x,0,.54],zero,unit,{...cyan,emission:.2});
 part(2,'core-halo',()=>ring(2.15,.009),[0,0,-.4],[.35,0,0],unit,{...cyan,emission:.1});
 // 03 — twin product shells. Geometry is intentionally schematic.
 for(let panel=0;panel<2;panel++){
  const x=panel===0?-.45:.55,y=panel===0?.45:-.38,z=panel===0?-.25:.35;
  part(3,'screen',()=>box(2.45,1.68,.11),[x,y,z],zero,unit,dark);
  part(3,'screen-outline',()=>pathTube(roundedRectPath(2.46,1.69,.08),.018,96,7),[x,y,z+.06],zero,unit,panel===0?cyan:amber);
  part(3,'screen-top',()=>box(2.25,.012,.01),[x,y+.52,z+.07],zero,unit,{color:[.45,.5,.55],metal:.2,emission:.1});
  for(let j=0;j<3;j++)part(3,'screen-button',()=>sphere(.028,8,10),[x-1+j*.095,y+.69,z+.077],zero,unit,j===0?(panel===0?cyan:amber):silver);
  part(3,'screen-sidebar',()=>box(.43,1.17,.01),[x-.86,y-.12,z+.07],zero,unit,{color:[.1,.14,.2],metal:.1,emission:.06});
  for(let row=0;row<4;row++){
   part(3,'ui-line',()=>box(1.28,.018,.014),[x+.15,y+.29-row*.23,z+.08],zero,[row===3?.65:1,1,1],{color:[.32,.43,.47],metal:.25,emission:.08});
   if(panel===1)part(3,'ui-dot',()=>sphere(.032,8,10),[x-.54,y+.28-row*.23,z+.09],zero,unit,amber);
  }
 }
 // 04 — connected units: intent, context, change, evidence.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2+.3,x=Math.cos(a)*1.25,y=Math.sin(a)*1.25;
  part(4,'workflow-unit',()=>box(.56,.56,.56),[x,y,0],[.45,.6,i*.35],unit,silver,{spin:[.025,.04,.012],bob:i*.5});
  part(4,'workflow-beacon',()=>sphere(.09,12,20),[x,y,.45],zero,unit,i===3?amber:cyan,{mode:true});
 }
 part(4,'workflow-path',()=>ring(1.26,.016),zero,[0,0,.3],unit,{...cyan,emission:.2});
 part(4,'workflow-centre',()=>knot(.22,.10),zero,[.3,.2,.6],unit,silver,{spin:[.02,.08,.03]});
 return stations;
}
export function stationMatrix(s:number,time:number):Mat4{
 const rotation:Vec3=s===2?[.22,-.45,-.13]:s===3?[.06,-.28,.035]:[0,0,0];
 const size:Vec3=s===0?[1.14,1.14,1.14]:[1,1,1];
 return compose([1.65,(s===0?.02:0)+Math.sin(time*.45+s)*.035,-16*s],rotation,size);
}
export function localPartMatrix(item:Pick<ModelPart,'transform'|'spin'|'bob'|'mode'>,time:number,mode:string):Mat4{
 const sp=item.spin,rotation=sp?compose([0,item.bob!==undefined?Math.sin(time*.7+item.bob)*.035:0,0],[time*sp[0],time*sp[1],time*sp[2]]):null;
 let model=rotation?multiply(item.transform,rotation):item.transform;
 if(item.mode&&mode!=='idle'){const k=1+Math.sin(time*(mode==='voice'?4:1.7))*.025;model=multiply(model,compose([0,0,0],[0,0,0],[k,k,k]));}
 return model;
}
