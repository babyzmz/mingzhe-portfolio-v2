// Mojo product pages: progressive enhancement only. The pages are complete without JS.
(()=>{
 'use strict';
 // A captured screenshot that fails to load falls back to its labelled placeholder.
 for(const img of document.querySelectorAll('img[data-shot-img]')){
  const swap=()=>{const fallback=img.parentElement&&img.parentElement.querySelector('[data-shot-fallback]');if(fallback){fallback.hidden=false;img.remove();}};
  if(img.complete&&img.naturalWidth===0)swap();else img.addEventListener('error',swap,{once:true});
 }
})();
