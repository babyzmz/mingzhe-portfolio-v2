/**
 * Renders real project media: cover shots, the in-case gallery and the
 * enlarged media layer. Pure string output — media-controller.ts owns the
 * behaviour, so this module stays free of document side effects.
 */
import type {Locale} from './state.js';
import type {ProjectMedia} from './project-types.js';
import {EVIDENCE_KIND_LABELS} from './project-media.js';

const esc=(s:string):string=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

/** Real screenshot used where the illustration art used to be; labelled. */
export function coverFigure(media:ProjectMedia,lang:Locale,eager=false):string{
 const kind=EVIDENCE_KIND_LABELS[media.evidenceKind][lang];
 const loading=eager?'eager':'lazy';
 const src=esc(media.src);
 const size=media.type==='video'&&media.poster?esc(media.poster):src;
 return `<figure class="mini-shot" data-cover-media="${esc(media.id)}">
 <img src="${size}" alt="${esc(media.alt[lang])}" width="${media.width}" height="${media.height}" loading="${loading}" decoding="async" data-media-fallback-img>
 <figcaption class="mini-shot-note"><i></i>${esc(kind)}</figcaption>
 <span class="mini-shot-broken" data-media-broken hidden>${lang==='zh'?'截图暂时无法加载':'Capture currently unavailable'}</span>
</figure>`;
}

function itemFigure(item:ProjectMedia,lang:Locale,index:number):string{
 const kind=EVIDENCE_KIND_LABELS[item.evidenceKind][lang];
 const controls=item.type==='video'
  ? `<video controls playsinline preload="none" width="${item.width}" height="${item.height}"${item.poster?` poster="${esc(item.poster)}"` : ''} src="${esc(item.src)}" data-media-video></video>`
  : `<img src="${esc(item.src)}" alt="${esc(item.alt[lang])}" width="${item.width}" height="${item.height}" loading="${index===0?'eager':'lazy'}" decoding="async" data-media-fallback-img>`;
 return `<figure class="media-item media-${item.type}" data-media-open="${esc(item.id)}" data-media-index="${index}" tabindex="0" role="button" aria-label="${lang==='zh'?'放大查看媒体':'Enlarge media'}: ${esc(item.alt[lang])}">
 ${controls}
 <span class="media-broken" data-media-broken hidden>${lang==='zh'?'媒体暂时无法加载':'Media currently unavailable'}</span>
 <figcaption><span class="media-kind">${esc(kind)}</span><span class="media-caption">${esc(item.caption[lang])}</span><span class="media-provenance">${esc(item.provenance[lang])}</span></figcaption>
 </figure>`;
}

/** Gallery block rendered inside the case overview; empty string when none. */
export function gallerySection(items:ProjectMedia[],lang:Locale):string{
 if(items.length===0)return '';
 const title=lang==='zh'?'实际运行素材':'Real captures';
 const hint=lang==='zh'?'点击或回车放大；视频不会自动播放。':'Open to enlarge. Videos never autoplay.';
 return `<div class="case-gallery" data-media-gallery>
 <div class="case-gallery-head"><h4>${title}</h4><span>${hint}</span></div>
 <div class="case-gallery-grid">${items.map((item,i)=>itemFigure(item,lang,i)).join('')}</div>
 </div>`;
}

/** The enlarged layer lives inside the case dialog so focus stays trapped. */
export function lightboxShell(lang:Locale):string{
 const close=lang==='zh'?'关闭放大视图':'Close enlarged view';
 const prev=lang==='zh'?'上一张':'Previous';
 const next=lang==='zh'?'下一张':'Next';
 return `<div class="media-lightbox" data-media-lightbox hidden role="dialog" aria-modal="true" aria-label="${lang==='zh'?'媒体放大视图':'Enlarged media'}">
 <button class="media-lightbox-close" data-media-close aria-label="${close}">×</button>
 <button class="media-lightbox-step prev" data-media-step="-1" aria-label="${prev}">←</button>
 <div class="media-lightbox-stage" data-media-stage></div>
 <button class="media-lightbox-step next" data-media-step="1" aria-label="${next}">→</button>
 <figcaption class="media-lightbox-caption" data-media-caption></figcaption>
 </div>`;
}

export function lightboxMediaHtml(item:ProjectMedia,lang:Locale,index:number,total:number):string{
 const counter=`${index+1} / ${total}`;
 const kind=EVIDENCE_KIND_LABELS[item.evidenceKind][lang];
 if(item.type==='video'){
  return `<figure class="lightbox-figure"><video controls playsinline preload="metadata" autoplay width="${item.width}" height="${item.height}"${item.poster?` poster="${esc(item.poster)}"` : ''} src="${esc(item.src)}" data-media-lightbox-video></video>
  <figcaption><span class="media-kind">${esc(kind)}</span><span class="media-caption">${esc(item.caption[lang])}</span><span class="media-provenance">${esc(item.provenance[lang])}</span><b>${counter}</b></figcaption></figure>`;
 }
 return `<figure class="lightbox-figure"><img src="${esc(item.src)}" alt="${esc(item.alt[lang])}" width="${item.width}" height="${item.height}" data-media-fallback-img>
 <figcaption><span class="media-kind">${esc(kind)}</span><span class="media-caption">${esc(item.caption[lang])}</span><span class="media-provenance">${esc(item.provenance[lang])}</span><b>${counter}</b></figcaption></figure>`;
}
