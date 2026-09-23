/** BorderGlow edge/angle and SpotlightCard pointer mapping adapted from React Bits.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause; see bundled notice.
 */
export function lightCoordinates(x:number,y:number,width:number,height:number){
 const w=Number.isFinite(width)&&width>0?width:1,h=Number.isFinite(height)&&height>0?height:1;
 x=Number.isFinite(x)?Math.min(w,Math.max(0,x)):w/2;y=Number.isFinite(y)?Math.min(h,Math.max(0,y)):h/2;
 const dx=x-w/2,dy=y-h/2;
 return {x,y,edge:Math.min(1,Math.max(Math.abs(dx)/(w/2),Math.abs(dy)/(h/2))),angle:dx===0&&dy===0?0:(Math.atan2(dy,dx)*180/Math.PI+450)%360};
}
export function createCardLight(reduced:()=>boolean){
 let active:HTMLElement|null=null,frame=0,point={x:0,y:0},suspended=false,disposed=false;
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 function clear(){if(active){active.removeAttribute('data-light-active');active=null}cancelAnimationFrame(frame);frame=0}
 function draw(){
  frame=0;if(!active||disposed||suspended||reduced()||active.hidden)return;
  const r=active.getBoundingClientRect(),p=lightCoordinates(point.x-r.left,point.y-r.top,r.width,r.height);
  active.style.setProperty('--mouse-x',p.x.toFixed(2)+'px');active.style.setProperty('--mouse-y',p.y.toFixed(2)+'px');
  active.style.setProperty('--cursor-angle',p.angle.toFixed(2)+'deg');active.style.setProperty('--edge-proximity',String(p.edge*100));
  active.dataset.lightActive='true';
 }
 const move=(event:PointerEvent)=>{
  if(disposed||suspended||reduced()||!fine.matches||event.pointerType==='touch'){clear();return}
  const target=event.target instanceof Element?event.target.closest<HTMLElement>('#work [data-card-light]'):null;
  if(target!==active){clear();active=target}if(!active)return;
  point={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(draw);
 };
 const out=(event:PointerEvent)=>{const related=event.relatedTarget; if(active&&!(related instanceof Node&&active.contains(related)))clear()};
 const visibility=()=>{if(document.hidden)clear()};
 document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerout',out,{passive:true});
 document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',clear);window.addEventListener('scroll',clear,{passive:true});
 return {refresh:clear,setPaused:clear,setSuspended:(v:boolean)=>{suspended=v;clear()},dispose:()=>{disposed=true;clear();document.removeEventListener('pointermove',move);document.removeEventListener('pointerout',out);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',clear);window.removeEventListener('scroll',clear)}};
}
