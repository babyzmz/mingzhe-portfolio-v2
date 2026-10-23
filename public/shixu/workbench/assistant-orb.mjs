import{createLiveOrb}from'./live-orb.mjs?v=duo18a-20261024';
export function orbMarkup(){return '<span class="assistant-orb" data-assistant-orb data-preserve-visual="xiaoshi" aria-hidden="true"><span class="orb-fallback"><i></i><i></i></span><canvas></canvas></span>';}
// A single reusable physical canvas keeps its phase across page and panel changes.
export function installAssistantOrbs(){
 const abort=new AbortController(),parking=document.createDocumentFragment();let frame=0,disposed=false,state='idle',settle=0,el=null,instance=null,creations=0;
 const visible=node=>{if(document.hidden||!node.isConnected)return false;const r=node.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
 function refresh(){if(frame||disposed)return;frame=requestAnimationFrame(()=>{frame=0;if(disposed)return;document.documentElement.classList.toggle('assistant-visuals-paused',document.hidden);document.querySelectorAll('[data-orb-mini]').forEach(n=>n.dataset.chatState=state);
  const target=[...document.querySelectorAll('.web-assistant-main [data-assistant-orb],.web-assistant:not(.assistant-motion-exit) [data-assistant-orb]')].find(visible);
  if(!target){instance?.setOptions({paused:true});if(el&&!el.isConnected)parking.append(el);return;}
  if(!el)el=target;else if(target!==el)target.replaceWith(el);
  el.dataset.chatState=state;
  if(!instance){try{instance=createLiveOrb(el.querySelector('canvas'),{variant:'custom',color:'#8D79E8',eyeColor:'#FFFFFF',interactive:!window.Capacitor?.isNativePlatform?.()&&matchMedia('(hover:hover) and (pointer:fine)').matches,blink:true,conversationState:state,onHasGl:ok=>{el.dataset.glReady=String(ok);}});if(instance)creations++;else el.dataset.glReady='false';}catch{el.dataset.glReady='false';}}
  instance?.setOptions({conversationState:state,paused:false});
 });}
 const observer=new MutationObserver(refresh);observer.observe(document.querySelector('#main'),{childList:true,subtree:true});const workspace=document.querySelector('.workspace');observer.observe(workspace,{attributes:true,attributeFilter:['class']});const column=document.querySelector('.web-assistant');if(column)observer.observe(column,{childList:true,subtree:true});
 for(const name of['resize','scroll','pageshow'])window.addEventListener(name,refresh,{signal:abort.signal,passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)instance?.setOptions({paused:true});refresh();},{signal:abort.signal});
 function setState(next,rest='idle'){
  if(!['idle','thinking','searching','planning','confirming','focusing','replying','error'].includes(next))throw new TypeError('Unknown assistant state');
  if(disposed||state===next&&next!=='replying')return;clearTimeout(settle);state=next;document.querySelectorAll('[data-orb-mini]').forEach(n=>n.dataset.chatState=state);if(el)el.dataset.chatState=state;instance?.setOptions({conversationState:state});
  if(next==='replying')settle=setTimeout(()=>setState(rest),900);
 }
 function destroy(){clearTimeout(settle);cancelAnimationFrame(frame);if(disposed)return;disposed=true;observer.disconnect();abort.abort();instance?.destroy();instance=null;el=null;}
 window.addEventListener('pagehide',event=>{if(event.persisted)instance?.setOptions({paused:true});else destroy();},{signal:abort.signal});refresh();
 return{refresh,destroy,setState,stats:()=>({state,mounted:el?.isConnected?1:0,webgl:instance?1:0,creations,phase:instance?.stats?.()??null})};
}
