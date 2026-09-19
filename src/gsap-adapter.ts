export type ScrollAdapter={refresh:()=>void;dispose:()=>void};
/** Loaded only when installed by Vite. Never fabricates a GSAP instance offline. */
export async function attachGsap(onProgress:(y:number)=>void,getDistance:()=>number):Promise<ScrollAdapter|null>{
 try{
  const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  const playhead={value:0};
  const tween=gsap.to(playhead,{value:1,ease:'none',onUpdate:()=>onProgress(playhead.value*getDistance()),scrollTrigger:{trigger:'#journey',start:'top top',end:()=>'+='+getDistance(),scrub:.45,invalidateOnRefresh:true}});
  return{refresh:()=>ScrollTrigger.refresh(),dispose:()=>{tween.scrollTrigger?.kill();tween.kill()}};
 }catch{return null;}
}
