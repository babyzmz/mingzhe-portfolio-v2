import {projects,profile,text,type Project} from './content.js';
import type {Locale} from './state.js';
import {caseStudies} from './case-content.js';
import {caseLabels} from './case-labels.js';
import type {ProjectId,LinkKind} from './project-types.js';
import {linksByKind,LINK_KIND_LABELS} from './project-links.js';
import {coverFor,gallery} from './project-media.js';
import {coverFigure,gallerySection} from './media-view.js';
export const esc=(s:string):string=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const arrow='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>';
const down='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.4"/></svg>';
const plus='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.4"/></svg>';
const mark='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 25V7l8 11 8-11v18M20 7h8L20 25h8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
function art(p:Project):string{
 const kind=p.id;
 if(kind==='fairy')return '<div class="mini-eye"><i></i><b></b><em></em></div><span class="art-note">LOCAL-FIRST / DESKTOP</span>';
 if(kind==='core')return '<div class="mini-core"><i></i><i></i><i></i><i></i></div><span class="art-note">CAPABILITIES / EXECUTION</span>';
 if(kind==='claw'||kind==='ax')return `<div class="mini-window"><div><b>${kind==='claw'?'M/':'AX'}</b><i></i><i></i></div><section><aside></aside><span><i></i><i></i><i></i></span></section></div><span class="art-note">${kind==='claw'?'PERSONAL / WORKSPACE':'ENTERPRISE / WORKSPACE'}</span>`;
 if(kind==='dreambound')return '<div class="mini-landscape"><i class="moon"></i><i class="mountain one"></i><i class="mountain two"></i><b>Dreambound<br><em>Realm</em></b></div><span class="art-note">CANVAS / ORIGINAL PROJECT</span>';
 if(kind==='webchange')return '<div class="mini-delta">Δ<span>Observe.<br>Compare.</span></div><span class="art-note">ELECTRON / INTERFACE STUDY</span>';
 if(kind==='goodnight')return '<div class="mini-goodnight">goodnight<span>A COMMERCE EXPLORATION</span><i>✳</i></div><span class="art-note">NEXT.JS / STORE</span>';
 if(kind==='tarot')return '<div class="mini-tarot"><i></i><i></i><i></i><b>✧</b></div><span class="art-note">AI / GENERATIVE REPORTS</span>';
 return '<div class="mini-converter"><span>.a</span><b>↔</b><span>.b</span></div><span class="art-note">PYTHON / DESKTOP UTILITY</span>';
}
/** Labelled illustration fallback stays until an approved screenshot exists. */
const isSingleFileEdition=()=>typeof window!=='undefined'&&(window as unknown as {__PORTFOLIO_SINGLE_FILE__?:boolean}).__PORTFOLIO_SINGLE_FILE__===true;
function cardArt(p:Project,lang:Locale,eager=false):string{
 const cover=isSingleFileEdition()?null:coverFor(p.id as ProjectId);
 return cover?coverFigure(cover,lang,eager):art(p);
}
function projectLinksHtml(p:Project,lang:Locale):string{
 const groups=linksByKind(p.id as ProjectId);
 const order:LinkKind[]=['demo','source','download','record'];
 const t=text[lang];
 const blocks=order.flatMap(kind=>groups[kind].map(link=>{
  const restricted=link.access==='restricted';
  const note=restricted&&link.accessNote?`<span class="case-link-note">${esc(link.accessNote[lang])}</span>`:'';
  const cls=kind==='record'?'case-link-quiet':'case-link-btn';
  const icon=kind==='download'?down:arrow;
  return `<span class="case-link"><a class="${cls}" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(LINK_KIND_LABELS[kind][lang])}${icon}</a>${note}</span>`;
 }));
 if(blocks.length)return `<div class="case-link-list">${blocks.join('')}</div>`;
 return `<p class="private-note">${esc(t.private)} · ${lang==='zh'?'仅展示适合公开的项目说明':'Public-safe project description only'}</p>`;
}
export function card(p:Project,lang:Locale,index:number):string{
 const c=p[lang],t=text[lang];
 const grouped=linksByKind(p.id as ProjectId);
 const accessLabel=grouped.source.length?t.publicSource:grouped.record.length?t.record:t.private;
 return `<article class="project-card" data-project-card="${p.id}" data-kind="${p.kind}">
 <button class="project-art art-${p.id}${(!isSingleFileEdition()&&coverFor(p.id as ProjectId))?' has-real-cover':''}" data-case="${p.id}" aria-label="${esc(p.name+' — '+t.detail)}"><span class="art-index">${String(index+1).padStart(2,'0')}</span>${cardArt(p,lang)}<span class="art-open">${arrow}</span></button>
 <div class="project-topline"><span>${esc(c.category)}</span><span>${p.kind==='ai'?'↗':'↳'}</span></div><h3><button data-case="${p.id}">${esc(p.name)}</button></h3>
 <p>${esc(c.summary)}</p><div class="project-bottom"><span>${esc(accessLabel)}</span><button data-case="${p.id}" aria-label="${esc(p.name+' — '+t.detail)}">${plus}</button></div></article>`;
}
export function renderSite(lang:Locale):string{
 const t=text[lang];
 const btn=(id:string,label=t.case)=>`<button class="text-button" data-case="${id}">${esc(label)}<span>${arrow}</span></button>`;
 return `<a class="skip-link" href="#work">${t.skip}</a>
 <header class="header"><a class="brand" href="#home" aria-label="Mingzhe Zhang — ${t.back}">${mark}<span>MINGZHE<span class="brand-dot">.</span></span></a>
 <nav class="main-nav" aria-label="${lang==='en'?'Main navigation':'主导航'}"><a href="#work">${t.navWork}</a><a href="#method">${t.navMethod}</a><a href="#about">${t.navAbout}</a></nav>
 <div class="header-actions"><button class="language-toggle" data-locale aria-label="${lang==='en'?'Switch to Chinese':'切换为英文'}"><span class="${lang==='en'?'selected':''}">EN</span><i>/</i><span class="${lang==='zh'?'selected':''}">中</span></button><a class="contact-pill" href="#contact">${t.navContact}<span>↗</span></a><button class="menu-toggle" data-menu aria-label="${t.menu}" aria-expanded="false"><i></i><i></i></button></div></header>
 <main><div id="journey" class="journey">
 <section class="chapter hero" id="home" data-scene="0"><div class="chapter-inner">
 <div class="hero-copy"><p class="eyebrow"><i class="status-dot"></i>${t.heroKicker}</p><h1>${t.heroA}<br><span>${t.heroB}</span></h1><p class="hero-description">${t.heroDesc}</p>
 <div class="hero-actions"><a class="primary-button" href="#fairy">${t.heroCta}${arrow}</a><a class="secondary-button" href="${profile.resume}" download="Mingzhe_Zhang_Resume.pdf">${t.resume}${down}</a></div>
 <div class="hero-credentials"><span>RMIT<span class="credential-small">Business Information Systems</span></span><i></i><span>${t.location}<span class="credential-small">${t.role}</span></span></div></div>
 <div class="hero-annotation" aria-hidden="true"><span>01—05</span><i></i><span>SYSTEMS<br>IN MOTION</span></div>
 <div class="hero-bottom"><a href="#fairy" class="scroll-cue"><span>${down}</span>${t.scroll}</a><div class="render-caption">${t.optical}<span>FORM 001 / CONTINUOUS SURFACE</span></div></div>
 </div></section>
 <section class="chapter" id="fairy" data-scene="1"><div class="chapter-inner">
 <div class="chapter-copy"><p class="eyebrow">${t.fairyKicker}</p><h2>${t.fairyA}<br><span class="accent-cyan">${t.fairyB}</span></h2><p class="chapter-desc">${t.fairyDesc}</p>
 <div class="feature-tags"><span>MCP & Skills</span><span>${lang==='en'?'Documents & voice':'文档与语音'}</span><span>${lang==='en'?'Project workspace':'项目工作空间'}</span></div>
 <p class="status-line"><i class="status-dot"></i>${t.fairyNote}</p>${btn('fairy')}<a class="quiet-link" href="https://github.com/babyzmz/Fairy-LLM" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a></div>
 <div class="scene-control"><div class="mode-switcher" aria-label="${t.look}"><button class="active" aria-pressed="true" data-fairy-mode="idle">${t.idle}</button><button aria-pressed="false" data-fairy-mode="think">${t.think}</button><button aria-pressed="false" data-fairy-mode="voice">${t.voice}</button></div><p>${t.fairyVisual}</p></div>
 <div class="section-baseline"><span>FAIRY</span><span>REACT / TAURI / PYTHON</span></div>
 </div></section>
 <section class="chapter" id="core" data-scene="2"><div class="chapter-inner"><div class="chapter-copy"><p class="eyebrow">${t.coreKicker}</p><h2>${t.coreA}<br><span class="silver-text">${t.coreB}</span></h2><p class="chapter-desc">${t.coreDesc}</p><div class="core-features"><span><b>01</b>${t.coreTag1}</span><span><b>02</b>${t.coreTag2}</span><span><b>03</b>${t.coreTag3}</span></div>${btn('core')}<p class="boundary-note">${t.coreBoundary}</p></div>
 <div class="layer-labels" aria-hidden="true"><span>CAPABILITY LAYER</span><span>EXECUTION LAYER</span><span>RECOVERY LAYER</span></div><div class="section-baseline"><span>MOJOCORE</span><span>${t.diagram}</span></div></div></section>
 <section class="chapter" id="mojo" data-scene="3"><div class="chapter-inner"><div class="chapter-copy"><p class="eyebrow">${t.mojoKicker}</p><h2>${t.mojoA}<br><span class="accent-amber">${t.mojoB}</span></h2><p class="chapter-desc">${t.mojoDesc}</p>
 <div class="workbench-links"><button data-case="claw"><span class="product-monogram">M/</span><span><b>MojoClaw</b><small>${t.clawLabel}</small></span>${arrow}</button><button data-case="ax"><span class="product-monogram amber">AX</span><span><b>MojoAX</b><small>${t.axLabel}</small></span>${arrow}</button></div>
 </div><div class="section-baseline"><span>MOJOCLAW / MOJOAX</span><span>${t.diagram}</span></div></div></section>
 <section class="chapter method-chapter" id="method" data-scene="4"><div class="chapter-inner"><div class="chapter-copy"><p class="eyebrow">${t.methodKicker}</p><h2>${t.methodA}<br><span class="silver-text">${t.methodB}</span></h2><p class="chapter-desc">${t.methodDesc}</p><div class="tool-pair"><span><i>⌘</i>Codex</span><span><i>✳</i>Claude</span></div><p class="method-quote">${t.methodCallout.replace('\\n','<br>')}</p></div>
 <div class="method-steps">${[1,2,3,4].map(n=>`<article><span>0${n}</span><div><h3>${t['step'+n]}</h3><p>${t['step'+n+'d']}</p></div></article>`).join('')}<p class="illustration-note">${t.methodProof}</p></div></div></section>
 </div>
 <section class="work-section light-section" id="work"><div class="section-wrap"><div class="archive-heading"><div><p class="eyebrow">${t.archiveKicker}</p><h2>${t.archiveA}<br><span>${t.archiveB}</span></h2></div><div class="archive-intro"><span class="archive-asterisk" aria-hidden="true">✳</span><p>${t.archiveDesc}</p></div></div>
 <div class="filter-bar"><div role="group" aria-label="${lang==='en'?'Project filters':'项目筛选'}"><button class="active" data-filter="all" aria-pressed="true">${t.all}<span>09</span></button><button data-filter="ai" aria-pressed="false">${t.ai}<span>04</span></button><button data-filter="archive" aria-pressed="false">${t.archive}<span>05</span></button></div><span class="filter-count"><b id="project-count">09</b> ${t.catalogCount}</span></div>
 <div class="project-grid">${projects.map((p,i)=>card(p,lang,i)).join('')}</div>
 <div class="archive-footnote"><span>↳</span><p>${lang==='en'?'Every project keeps its context. Open a case to see contribution scope, source basis and current limitations.':'每个项目都保留自己的上下文。打开项目详情，可以查看参与范围、来源依据和当前限制。'}</p><button data-evidence>${t.evidence}${arrow}</button></div></div></section>
 <section class="about-section" id="about"><div class="section-wrap"><p class="eyebrow">${t.aboutKicker}</p><div class="about-layout"><div class="about-copy"><h2>${t.aboutA}<br><span>${t.aboutB}</span></h2><p>${t.aboutDesc}</p><p>${t.aboutDesc2}</p><div class="personal-facts"><span>${t.citizen}</span><span>${t.languages}</span></div><p class="guitar-note"><span>♫</span>${t.guitar}</p><a class="text-button" href="${profile.resume}" download="Mingzhe_Zhang_Resume.pdf">${t.resume}<span>${down}</span></a></div>
 <div class="timeline"><p class="timeline-title">${t.background}<span>01—04</span></p>
 <article><span class="timeline-date">2022 — 2024</span><div><h3>${t.degree}</h3><p>RMIT University · Melbourne</p><small>Jul 2022 — Dec 2024</small></div></article>
 <article><span class="timeline-date">2023</span><div><h3>${t.intern}</h3><p>Jan — Mar 2023</p><small>${t.internDesc}</small></div></article>
 <article><span class="timeline-date">2020 — 2021</span><div><h3>${t.diploma}</h3><p>RMIT University · Melbourne</p><small>2020 — Jun 2021</small></div></article>
 <article><span class="timeline-date">2016 — 2018</span><div><h3>${t.school}</h3><p>Keysborough, Victoria</p></div></article><p class="timeline-source">${t.experienceSource}</p></div></div>
 <div class="skills-header"><h3>${t.skillsTitle}</h3><p>${t.skillsNote}</p></div><div class="skill-grid">
 <article><span>01</span><h4>${t.skills1}</h4><p>Codex · Claude<br>Cursor · Windsurf</p></article>
 <article><span>02</span><h4>${t.skills2}</h4><p>TypeScript · JavaScript · React<br>Python · Tauri / Rust</p></article>
 <article><span>03</span><h4>${t.skills3}</h4><p>Git / GitHub · Docker · SQL<br>Windows · macOS · Linux</p></article>
 <article><span>04</span><h4>${t.skills4}</h4><p>Model APIs · MCP · Skills<br>RAG · STT / TTS · SSE</p></article></div><p class="foundations">${lang==='en'?'Additional learning foundations':'其他学习基础'}: HTML / CSS · Vue.js · Java · PHP · ${lang==='en'?'Database design · Microsoft Office':'数据库设计 · Microsoft Office'}</p></div></section>
 <section class="contact-section" id="contact"><div class="section-wrap"><div class="contact-top"><p class="eyebrow">${t.contactKicker}</p><span class="contact-spark" aria-hidden="true">✳</span></div><h2>${t.contactA}<br><span>${t.contactB}</span></h2><div class="contact-bottom"><p>${t.contactDesc}</p><div><a class="email-link" href="mailto:${profile.email}" aria-label="${t.contactLink}">${profile.email}${arrow}</a><div class="contact-small"><button data-copy>${t.copy}</button><a href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${profile.resume}" download="Mingzhe_Zhang_Resume.pdf">${t.resume} ↓</a></div></div></div></div></section>
 </main><footer class="footer"><a class="brand" href="#home">${mark}<span>MINGZHE.</span></a><p>${t.footer}</p><button data-evidence>${t.evidence}</button><a href="#home" class="back-top" aria-label="${t.back}">↑</a></footer>
 <aside class="chapter-rail" aria-label="${t.index}">${['home','fairy','core','mojo','method'].map((id,i)=>`<a href="#${id}" data-rail="${i}" aria-label="${['Intro','Fairy','MojoCore','MojoClaw & MojoAX',t.navMethod][i]}"><span>${String(i).padStart(2,'0')}</span><i></i></a>`).join('')}</aside>
 <div class="motion-dock"><span class="render-status"><i></i><span data-render-label>${t.live}</span></span><button data-motion aria-label="${t.motionOn}" aria-pressed="false"><span class="pause-icon"><i></i><i></i></span><span class="motion-label">${t.motionOn}</span></button></div>`;
}
export function renderCase(p:Project,lang:Locale):string{
 const c=p[lang],t=text[lang],d=caseStudies[p.id][lang],l=caseLabels[lang];
 const index=projects.findIndex(item=>item.id===p.id),previous=projects[(index+projects.length-1)%projects.length],next=projects[(index+1)%projects.length];
 const sectionTitle=(number:string,title:string)=>`<div class="case-section-title" data-reveal><span>${number}</span><h3>${esc(title)}</h3></div>`;
 const links=projectLinksHtml(p,lang);
 const cover=isSingleFileEdition()?null:coverFor(p.id as ProjectId);
 const heroCaption=cover?(lang==='zh'?'实际运行素材截图 · 非示意':'Captured from the running program'):l.visual;
 const mediaGallery=isSingleFileEdition()?'':gallerySection(gallery(p.id as ProjectId),lang);
 return `<div class="case-sheet" data-case-id="${p.id}">
 <header class="case-toolbar"><span class="case-series">${l.series}<b>${String(index+1).padStart(2,'0')} / 09</b></span><div class="case-tools"><button data-case-locale aria-label="${l.locale}">${lang==='zh'?'EN':'中文'}</button><button class="case-arrow" data-case-next="${previous.id}" aria-label="${l.labelPrev}">←</button><button class="case-arrow" data-case-next="${next.id}" aria-label="${l.labelNext}">→</button><button class="case-close" data-close aria-label="${l.close}"><span>${l.back}</span><b>×</b></button></div></header>
 <div class="case-scroll" tabindex="0" aria-label="${esc(p.name)} ${lang==='zh'?'项目详情':'case study'}">
 <section class="case-hero" data-case-section="overview">
  <div class="case-hero-copy"><p class="case-kicker" data-case-intro>${esc(c.category)}</p><h2 id="dialog-title" tabindex="-1" data-case-intro>${esc(p.name)}</h2><p class="case-tagline" data-case-intro>${esc(d.tagline)}</p><div class="case-stack" data-case-intro>${p.stack.map(item=>`<span>${esc(item)}</span>`).join('')}</div><div class="case-status" data-case-intro><i></i>${esc(c.status)}</div></div>
  <figure class="case-hero-art art-${p.id}${cover?' has-real-cover':''}" data-case-art aria-label="${heroCaption}"><div class="case-art-orbit" aria-hidden="true"></div>${cardArt(p,lang,true)}<figcaption>${esc(heroCaption)}</figcaption></figure>
 </section>
 <nav class="case-toc" aria-label="${lang==='zh'?'项目内容目录':'Case study navigation'}"><div class="case-toc-links">${['overview','workflow','features','build','evidence'].map((key,i)=>`<button data-case-jump="${key}" ${i===0?'aria-current="location"':''}><span>0${i+1}</span>${l[key]}</button>`).join('')}</div><span class="case-reading">${l.read}<b data-reading-label>00%</b></span><div class="case-progress"><i data-reading-bar></i></div></nav>
 <article class="case-article">
  <section class="case-overview case-section">
   ${sectionTitle('01',l.what)}<p class="case-body-lead" data-reveal>${esc(d.purpose)}</p><div class="case-audience" data-reveal><span>${l.for}</span><p>${esc(d.audience)}</p></div>${mediaGallery}
  </section>
  <section class="case-section case-workflow" data-case-section="workflow">
   ${sectionTitle('02',l.flow)}<div class="case-scenario" data-reveal><span>${l.intent}</span><blockquote>${esc(d.scenario)}</blockquote></div>
   <div class="case-flow-grid">${d.workflow.map((step,i)=>`<div class="case-flow-step" data-reveal><span class="case-step-no">${String(i+1).padStart(2,'0')}<i>→</i></span><h4>${esc(step.title)}</h4><p>${esc(step.body)}</p></div>`).join('')}</div><p class="case-illustration-note" data-reveal>${esc(d.workflowNote)}</p>
  </section>
  <section class="case-section" data-case-section="features">
   ${sectionTitle('03',p.kind==='archive'?l.capArchive:l.scope)}<div class="case-feature-grid">${d.capabilities.map((feature,i)=>`<div class="case-feature" data-reveal><span>0${i+1}</span><div><h4>${esc(feature.title)}</h4><p>${esc(feature.body)}</p></div></div>`).join('')}</div>
   <div class="case-relationship" data-reveal><span>↳</span><div><h4>${l.context}</h4><p>${esc(d.relationship)}</p></div></div>
  </section>
  <section class="case-section" data-case-section="build">
   ${sectionTitle('04',p.kind==='archive'?l.developmentArchive:l.hands)}<p class="case-body-lead" data-reveal>${esc(d.development)}</p><div class="case-decision-list">${d.decisions.map((item,i)=>`<div class="case-decision" data-reveal><span>0${i+1}</span><div><h4>${esc(item.title)}</h4><p>${esc(item.body)}</p></div></div>`).join('')}</div>
   <div class="case-glossary" data-reveal><button data-glossary-toggle aria-expanded="false" aria-controls="case-glossary-body"><span><b>${l.terms}</b><small>${d.terms.length} ${lang==='zh'?'个术语 · 点击展开':'terms · tap to expand'}</small></span><i aria-hidden="true">+</i></button><div id="case-glossary-body" hidden><dl>${d.terms.map(term=>`<div><dt>${esc(term.title)}</dt><dd>${esc(term.body)}</dd></div>`).join('')}</dl></div></div>
  </section>
  <section class="case-section case-proof" data-case-section="evidence">
   ${sectionTitle('05',l.verified)}<div class="case-proof-status" data-reveal><span>${l.status}</span><strong>${esc(c.status)}</strong></div><div class="case-proof-grid"><div data-reveal><h4>${l.basis}</h4><p>${esc(c.evidence)}</p>${links}</div><div data-reveal><h4>${l.limits}</h4><p>${esc(c.limits)}</p></div></div>
  </section>
  <footer class="case-next" data-reveal><div><span>${l.next}</span><button data-case-next="${next.id}">${esc(next.name)} ${arrow}</button></div><button class="case-return" data-close>${l.return} ↗</button></footer>
 </article></div></div>`;
}
export function renderEvidence(lang:Locale):string{
 const t=text[lang],l=caseLabels[lang];return `<div class="case-sheet evidence-sheet"><header class="case-toolbar"><span class="case-series">CONTENT / PROVENANCE</span><button class="case-close" data-close aria-label="${t.close}"><span>${l.back}</span><b>×</b></button></header><div class="case-scroll"><div class="dialog-content"><h2 id="dialog-title" tabindex="-1" data-case-intro>${t.evidenceTitle}</h2><p class="dialog-lead" data-case-intro>${t.evidenceIntro}</p>${['evidenceCv','evidenceRepo','evidenceScope','evidencePrivacy'].map((key,i)=>`<section data-reveal><h3>0${i+1}</h3><p>${t[key]}</p></section>`).join('')}<div class="source-links"><a href="${profile.resume}" download="Mingzhe_Zhang_Resume.pdf">${t.resume} ↓</a><a href="https://github.com/babyzmz/Fairy-LLM" target="_blank" rel="noopener noreferrer">Fairy repository ↗</a><a href="https://github.com/babyzmz/mingzhe-portfolio" target="_blank" rel="noopener noreferrer">${lang==='en'?'Original portfolio repository':'原作品集仓库'} ↗</a></div></div></div></div>`;
}
