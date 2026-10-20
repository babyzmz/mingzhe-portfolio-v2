// Gesture feedback only. All operations remain the existing delegated actions.
export function installItemSwipe(app){
 const abort=new AbortController(),signal=abort.signal,reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const points=new Set();let drag=null,opened=null,motion=null,frame=0,suppressUntil=0,suppressId='';
 const listen=(target,name,fn,options={})=>target.addEventListener(name,fn,{...options,signal});
 const modal=()=>!!document.querySelector('#modal-root .modal,dialog[open],.control-sheet[open]');
 const itemOf=row=>app.getState().items.find(i=>i.id===(row.dataset.swipeItem||row.dataset.item));
 const rightAllowed=item=>item?.type==='task'&&!item.dailyTarget;
 function rails(row){return [...row.querySelectorAll(':scope > .swipe-rail')];}
 function accessible(row,target){for(const rail of rails(row)){const visible=rail.dataset.side===(target<0?'left':target>0?'right':'');rail.setAttribute('aria-hidden',String(!visible));for(const b of rail.querySelectorAll('button'))b.disabled=!visible;}}
 function draw(row,x){row.style.setProperty('--swipe-offset',x+'px');row.dataset.swipeOffset=String(x);}
 function stop(){cancelAnimationFrame(frame);frame=0;motion=null;}
 function reset(row){if(!row)return;row.classList.remove('is-swiping','swipe-ready','swipe-open');row.style.removeProperty('--swipe-offset');delete row.dataset.swipeOffset;for(const rail of rails(row))rail.remove();if(opened===row)opened=null;}
 function settle(row,target,velocity=0){
  stop();row.classList.remove('is-swiping');if(target){opened=row;row.classList.add('swipe-open');}else if(opened===row)opened=null;
  accessible(row,target);
  const current=Number(row.dataset.swipeOffset)||0;
  if(reduce.matches||document.hidden){draw(row,target);if(!target)reset(row);return;}
  motion={row,x:current,target,v:velocity,last:0,start:0};
  const tick=time=>{
   const s=motion;if(!s||!s.row.isConnected){stop();return;}
   if(!s.start)s.start=time;const dt=Math.min((time-(s.last||time-16))/1000,.032);s.last=time;
   for(let n=0;n<2;n++){s.v+=(650*(s.target-s.x)-54*s.v)*dt/2;s.x+=s.v*dt/2;}
   draw(s.row,s.x);
   if(Math.abs(s.target-s.x)<.4&&Math.abs(s.v)<8||time-s.start>500||reduce.matches){const row=s.row,target=s.target;draw(row,target);stop();if(!target)reset(row);}else frame=requestAnimationFrame(tick);
  };frame=requestAnimationFrame(tick);
 }
 function release(){if(drag?.captured){try{drag.row.releasePointerCapture(drag.id);}catch{}}drag=null;}
 function close(){const rows=new Set([opened,drag?.row,motion?.row]);stop();release();for(const row of rows)reset(row);}
 function prepare(row,item){
  if(row.classList.contains('swipe-ready'))return;
  row.classList.add('swipe-ready');draw(row,0);
  const add=(side,commands)=>{const rail=document.createElement('div');rail.className='swipe-rail swipe-'+side;rail.dataset.side=side;rail.setAttribute('role','group');rail.setAttribute('aria-label','事项快捷操作');rail.setAttribute('aria-hidden','true');for(const[action,label]of commands){const button=document.createElement('button');button.type='button';button.className='swipe-action '+(action==='delete-item'?'swipe-delete':'');button.dataset.action=action;button.dataset.id=item.id;button.textContent=label;button.setAttribute('aria-label',label+'：'+item.title);button.disabled=true;rail.append(button);}row.append(rail);};
  add('left',[['edit','编辑'],['delete-item','删除']]);
  if(rightAllowed(item))add('right',[['complete',item.status==='done'?'恢复':'完成']]);
 }
 listen(document,'pointerdown',event=>{
  suppressUntil=0;
  if(event.pointerType!=='touch'&&event.pointerType!=='pen')return;
  points.add(event.pointerId);if(points.size>1||event.isPrimary===false){close();return;}
  if(modal())return;
  const row=event.target.closest('.task-row[data-swipe-item],.task-row[data-item]');
  if(!row){if(opened)close();return;}
  if(event.clientX<24||event.clientX>innerWidth-24||row.closest('.time-calendar,.month-grid,.year-grid,.control-sheet,.time-dialog'))return;
  if(event.target.closest('input,textarea,select,a,[contenteditable=true],[role=slider],.time-wheel,.swipe-action'))return;
  const button=event.target.closest('button');if(button&&!button.matches('.task-title[data-action=edit]'))return;
  const item=itemOf(row);if(!item)return;
  if(opened&&opened!==row)close();
  const wasMoving=motion?.row===row;const base=Number(row.dataset.swipeOffset)||0;if(wasMoving)stop();
  prepare(row,item);
  drag={row,id:event.pointerId,startX:event.clientX,startY:event.clientY,base,lastX:event.clientX,lastTime:event.timeStamp,v:0,captured:false,right:rightAllowed(item)};
 },{capture:true,passive:true});
 listen(document,'pointermove',event=>{
  const d=drag;if(!d||d.id!==event.pointerId)return;
  const dx=event.clientX-d.startX,dy=event.clientY-d.startY;
  if(!d.captured){
   if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){close();return;}
   if(Math.abs(dx)<12||Math.abs(dx)<Math.abs(dy)*1.4)return;
   if(dx>0&&!d.right&&d.base>=0){close();return;}
   d.captured=true;d.row.classList.add('is-swiping');try{d.row.setPointerCapture(d.id);}catch{}
  }
  if(event.cancelable)event.preventDefault();
  const elapsed=event.timeStamp-d.lastTime;if(elapsed>0)d.v=Math.max(-1.5,Math.min(1.5,(event.clientX-d.lastX)/elapsed));d.lastTime=event.timeStamp;d.lastX=event.clientX;
  draw(d.row,Math.max(-144,Math.min(d.right?72:0,d.base+dx)));
 },{capture:true,passive:false});
 listen(document,'pointerup',event=>{
  points.delete(event.pointerId);const d=drag;if(!d||d.id!==event.pointerId)return;
  if(!d.captured){release();if(!opened)reset(d.row);return;}
  const projected=(Number(d.row.dataset.swipeOffset)||0)+d.v*80,target=projected<-50?-144:projected>32&&d.right?72:0;
  suppressUntil=performance.now()+450;suppressId=d.row.dataset.swipeItem||d.row.dataset.item;
  release();settle(d.row,target,d.v*1000);
 },{capture:true});
 listen(document,'pointercancel',event=>{points.delete(event.pointerId);close();},{capture:true});
 listen(document,'dragstart',event=>{if(drag?.captured)event.preventDefault();},{capture:true});
 listen(document,'click',event=>{
  const action=event.target.closest('.swipe-action');if(action){close();return;}
  const row=event.target.closest('.task-row[data-item]');
  if(event.detail!==0&&row&&(performance.now()<suppressUntil&&(row.dataset.swipeItem||row.dataset.item)===suppressId||row===opened)){
   event.preventDefault();event.stopImmediatePropagation();if(row===opened&&performance.now()>=suppressUntil)close();return;
  }
  if(opened)close();
 },{capture:true});
 for(const name of ['scroll','wheel'])listen(document,name,close,{capture:true,passive:true});
 for(const name of ['shixu-render','shixu-change'])listen(window,name,close);
 listen(document,'keydown',event=>{if(event.key==='Escape'||event.key==='Tab')close();},{capture:true});
 const resetInteraction=()=>{points.clear();close();};
 listen(window,'blur',resetInteraction);listen(document,'visibilitychange',resetInteraction);
 listen(document,'toggle',()=>{if(modal())close();},{capture:true});
 const observer=new MutationObserver(()=>{if(modal())close();});observer.observe(document.body,{childList:true});const host=document.querySelector('#modal-root');if(host)observer.observe(host,{childList:true});
 listen(reduce,'change',()=>{if(motion){const {row,target}=motion;stop();draw(row,target);if(!target)reset(row);}});
 return{close,destroy(){close();observer.disconnect();abort.abort();points.clear();}};
}
