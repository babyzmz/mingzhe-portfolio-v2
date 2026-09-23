import {createWordReveal,type WordReveal} from './word-reveal.js';
import {createHeadingFill} from './heading-fill.js';
import {projects,profile,text} from './content.js';
import {renderSite,renderCase,renderEvidence} from './views.js';
import {normaliseLocale,safeStorageGet,safeStorageSet} from './state.js';
import {createMotion,type MotionController} from './motion.js';
import {createCaseDialog} from './case-dialog.js';
import {createMediaController} from './media-controller.js';
import type {ProjectId} from './project-types.js';
const root=document.documentElement,site=document.querySelector<HTMLDivElement>('#site')!,dialog=document.querySelector<HTMLDialogElement>('#case-dialog')!,canvas=document.querySelector<HTMLCanvasElement>('#scene')!;
let locale=normaliseLocale(safeStorageGet('mz.locale'));
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=safeStorageGet('mz.motion')==='off'||(!safeStorageGet('mz.motion')&&preference.matches);
let controller:MotionController|null=null,renderer:'webgl'|'software-3d'|'static'='static',openCase:string|null=null,toastTimer=0;
let words:WordReveal|null=null,headingFill:ReturnType<typeof createHeadingFill>|null=null;
function refreshText(){words?.refresh();headingFill?.refresh()}
function refreshControls(){
 root.lang=locale==='zh'?'zh-CN':'en';root.dataset.motion=paused?'reduced':'full';
 const button=document.querySelector<HTMLButtonElement>('button[data-motion]');
 if(button){button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',text[locale][paused?'motionOff':'motionOn']);const label=button.querySelector('.motion-label');if(label)label.textContent=text[locale][paused?'motionOff':'motionOn']}
 const status=document.querySelector('[data-render-label]');if(status)status.textContent=text[locale][renderer==='webgl'?'live':renderer==='software-3d'?'software':'static'];
 const description=document.querySelector<HTMLMetaElement>('meta[name="description"]');if(description)description.content=locale==='zh'?'Mingzhe Zhang（Richie），墨尔本 AI 应用开发者。探索 Fairy、MojoCore、MojoClaw、MojoAX 与早期作品。':'Mingzhe Zhang (Richie), Melbourne-based AI application developer. Explore Fairy, MojoCore, MojoClaw and MojoAX through an interactive 3D portfolio.';
}
function render(){site.innerHTML=renderSite(locale);refreshControls();controller?.refresh();refreshText()}
const caseController=createCaseDialog(dialog,{reduced:()=>paused||preference.matches,onOpened:()=>{controller?.setSuspended(true);words?.setSuspended(true);headingFill?.setSuspended(true)},onClosed:()=>{openCase=null;controller?.setSuspended(false);words?.setSuspended(false);headingFill?.setSuspended(false)},onCloseAttempt:()=>mediaController.consumeCloseAttempt()});
const mediaController=createMediaController(dialog,()=>openCase as ProjectId|null,()=>locale);
function showCase(id:string,trigger?:HTMLElement){const p=projects.find(item=>item.id===id);if(!p)return;openCase=id;void caseController.open(renderCase(p,locale),id,trigger).then(()=>mediaController.observeVideos())}
function showEvidence(trigger?:HTMLElement){openCase='evidence';void caseController.open(renderEvidence(locale),'evidence',trigger)}
function close(){void caseController.close()}
function notify(message:string){const toast=document.querySelector<HTMLElement>('#toast')!;toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>toast.classList.remove('visible'),2400)}
async function copyEmail(){
 let copied=false;try{await navigator.clipboard.writeText(profile.email);copied=true}catch{
  const input=document.createElement('textarea');input.value=profile.email;input.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(input);input.select();try{copied=document.execCommand('copy')}catch{}input.remove();
 }
 notify(copied?text[locale].copied:profile.email);
}
render();
controller=createMotion(canvas,paused,mode=>{renderer=mode;refreshControls()});
words=createWordReveal(()=>paused||preference.matches);
headingFill=createHeadingFill(()=>paused||preference.matches);
document.addEventListener('click',event=>{
 const element=event.target instanceof Element?event.target:null;if(!element)return;
 const action=element.closest<HTMLElement>('[data-case],[data-locale],button[data-motion],[data-close],[data-evidence],[data-filter],[data-copy],[data-menu],[data-fairy-mode],[data-case-next],[data-case-jump],[data-case-locale],[data-glossary-toggle]');
 if(!action){
  if(element.closest('.main-nav a')){document.querySelector('.main-nav')?.classList.remove('open');document.querySelector('[data-menu]')?.setAttribute('aria-expanded','false')}
  return;
 }
 if(action.dataset.case){showCase(action.dataset.case,action);return}
 if(action.dataset.caseNext){showCase(action.dataset.caseNext);return}
 if(action.dataset.caseJump){caseController.jump(action.dataset.caseJump);return}
 if(action.hasAttribute('data-glossary-toggle')){void caseController.toggleGlossary(action);return}
 if(action.hasAttribute('data-close')){close();return}
 if(action.hasAttribute('data-evidence')){showEvidence(action);return}
 if(action.hasAttribute('data-locale')||action.hasAttribute('data-case-locale')){
  const y=scrollY;locale=locale==='en'?'zh':'en';safeStorageSet('mz.locale',locale);render();
  // Preserve current reading position when changing language.
  window.scrollTo({top:y,behavior:'instant' as ScrollBehavior});controller?.refresh();refreshText();
  if(openCase&&dialog.open){const p=projects.find(item=>item.id===openCase);mediaController.setLocale(locale);void caseController.open(p?renderCase(p,locale):renderEvidence(locale),openCase,undefined,true).then(()=>mediaController.observeVideos())}
  else document.querySelector<HTMLElement>('[data-locale]')?.focus({preventScroll:true});return;
 }
 if(action.hasAttribute('data-motion')){paused=!paused;safeStorageSet('mz.motion',paused?'off':'on');refreshControls();controller?.setPaused(paused);words?.setPaused();headingFill?.setPaused();caseController.updateMotion();return}
 if(action.hasAttribute('data-copy')){void copyEmail();return}
 if(action.hasAttribute('data-menu')){const expanded=action.getAttribute('aria-expanded')!=='true';action.setAttribute('aria-expanded',String(expanded));document.querySelector('.main-nav')?.classList.toggle('open',expanded);return}
 if(action.dataset.filter){
  let visible=0;document.querySelectorAll<HTMLElement>('[data-project-card]').forEach(card=>{card.hidden=action.dataset.filter!=='all'&&card.dataset.kind!==action.dataset.filter;if(!card.hidden)visible++});
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button=>{const active=button===action;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
  const count=document.querySelector('#project-count');if(count)count.textContent=String(visible).padStart(2,'0');controller?.refresh();refreshText();return;
 }
 if(action.dataset.fairyMode){document.querySelectorAll('[data-fairy-mode]').forEach(button=>{button.classList.toggle('active',button===action);button.setAttribute('aria-pressed',String(button===action))});controller?.setMode(action.dataset.fairyMode)}
});
preference.addEventListener('change',event=>{if(!safeStorageGet('mz.motion')){paused=event.matches;refreshControls();controller?.setPaused(paused)}words?.setPaused();headingFill?.setPaused();caseController.updateMotion()});
// Preserve the live controller when the browser parks this page in bfcache.
window.addEventListener('pagehide',event=>{if(!event.persisted){caseController.dispose();mediaController.dispose();words?.dispose();headingFill?.dispose();controller?.dispose()}});
window.addEventListener('pageshow',event=>{if(event.persisted){controller?.refresh();refreshText()}});
// Restore anchors after font/layout settling. No external font request is made.
document.fonts.ready.then(()=>{controller?.refresh();refreshText()});
