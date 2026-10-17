/**
 * Mojo rendering: the shared architecture diagram, the extras block inside the
 * case reader, and the static product pages written to public/mojo/ by
 * scripts/build-mojo-pages.mjs. Pure string output, no document access.
 */
import type {Locale} from './state.js';
import {mojoPages, STATUS_LABELS, type MojoPage, type StatusKind} from './mojo-content.js';
import {mojoShots, placeholderShots, SHOT_STATUS_LABELS, shotsFor, type MojoProductId, type MojoShot} from './mojo-shots.js';

const esc = (s: string): string => s.replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]!));
export const MOJO_PRODUCTS: MojoProductId[] = ['claw', 'core', 'ax'];

/** Architecture diagram; `focus` highlights one product. Colours come from CSS. */
let svgSeq = 0;
export function architectureSvg(focus: MojoProductId | null): string {
 const n = ++svgSeq, T = `arch-t${n}`, D = `arch-d${n}`, H = `arch-head${n}`;
 const on = (id: MojoProductId) => (focus === id ? ' is-focus' : '');
 const box = (x: number, y: number, w: number, h: number, title: string, sub: string, cls = '') =>
  `<g class="arch-box${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/><text x="${x + 18}" y="${y + 30}" class="arch-title">${esc(title)}</text><text x="${x + 18}" y="${y + 52}" class="arch-sub">${esc(sub)}</text></g>`;
 const chips = ['Identity & sessions', 'Projects & checkpoints', 'Runs & ordered events', 'Model routing & ledger', 'Permissions & MCP grants', 'Memory & rules'];
 const chipEls = chips.map((c, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 64 + col * 252, y = 236 + row * 40;
  return `<g class="arch-chip"><rect x="${x}" y="${y}" width="236" height="30" rx="8"/><text x="${x + 118}" y="${y + 20}" text-anchor="middle">${esc(c)}</text></g>`;
 }).join('');
 const arrow = (x1: number, y1: number, x2: number, y2: number, dashed = false) =>
  `<line class="arch-line${dashed ? ' is-dashed' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${H})"/>`;
 return `<svg class="arch-svg" viewBox="0 0 880 470" role="img" aria-labelledby="${T} ${D}" xmlns="http://www.w3.org/2000/svg">
<title id="${T}">Mojo architecture</title>
<desc id="${D}">The web app, the Mac desktop app and the MojoAX workbench all talk to Mojo Core. Core alone calls model providers, runs the isolated preview runtime and instructs the Local Runner on the user's computer.</desc>
<defs><marker id="${H}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="arch-head"/></marker></defs>
${box(40, 24, 240, 70, 'MojoClaw · Web', 'Chat, cloud projects, remote view', on('claw'))}
${box(320, 24, 240, 70, 'MojoClaw · Mac desktop', 'Same renderer + Local Runner host', on('claw'))}
${box(600, 24, 240, 70, 'MojoAX workbench', 'Enterprise shell · in development', ' is-later' + on('ax'))}
${arrow(160, 94, 160, 168)}${arrow(440, 94, 440, 168)}${arrow(720, 94, 720, 168, true)}
<g class="arch-box arch-core${on('core')}"><rect x="40" y="170" width="800" height="150" rx="18"/><text x="64" y="206" class="arch-title">Mojo Core</text><text x="200" y="206" class="arch-sub">the only authority: apps render and forward, Core decides</text>${chipEls}</g>
${arrow(160, 320, 160, 384)}${arrow(440, 320, 440, 384)}${arrow(720, 320, 720, 384)}
${box(40, 386, 240, 70, 'Model providers', 'Through provider adapters')}
${box(320, 386, 240, 70, 'Isolated preview runtime', 'Signed URLs, sandboxed pages')}
${box(600, 386, 240, 70, 'Local Runner · your Mac', 'Bound folders, native sandbox', on('claw'))}
</svg>`;
}

function statusChip(kind: StatusKind): string {
 return `<span class="status-chip status-${kind}">${esc(STATUS_LABELS[kind])}</span>`;
}

function shotById(id: string | undefined | null): MojoShot | null {
 return id ? mojoShots.find(s => s.id === id) ?? null : null;
}

/** Placeholder that names the target file; never requests an image. */
function placeholder(shot: MojoShot, lang: Locale = 'en'): string {
 return `<div class="shot-placeholder" role="img" aria-label="${esc(shot.alt[lang])} — ${esc(SHOT_STATUS_LABELS[shot.status][lang])}" style="aspect-ratio:${shot.width}/${shot.height}" data-shot-id="${esc(shot.id)}" data-shot-status="${shot.status}">
 <span class="shot-placeholder-kind">${esc(SHOT_STATUS_LABELS[shot.status][lang])}</span>
 <strong>${esc(lang === 'en' ? shot.surface : shot.caption.zh)}</strong>
 <code>${esc(shot.file)}</code>
</div>`;
}

/** Figure for a static product page (relative prefix to public/). */
function pageFigure(shot: MojoShot | null, prefix: string, eager = false): string {
 if (!shot) return '';
 const body = shot.status === 'captured'
  ? `<img src="${prefix}${esc(shot.file)}" width="${shot.width}" height="${shot.height}" alt="${esc(shot.alt.en)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" data-shot-img="${esc(shot.id)}">${placeholder(shot).replace('class="shot-placeholder"', 'class="shot-placeholder" hidden data-shot-fallback')}`
  : placeholder(shot);
 const note = shot.status === 'captured' ? 'Captured from the running app · navigation cropped' : 'Placeholder · not a product image';
 return `<figure class="shot shot-${shot.status}">${body}<figcaption><span>${esc(note)}</span>${esc(shot.caption.en)}</figcaption></figure>`;
}

// ── Case reader extras (bilingual, inside the existing chaptered reader) ───
export function mojoCaseExtras(id: string, lang: Locale): string {
 if (id !== 'claw' && id !== 'core' && id !== 'ax') return '';
 const product = id as MojoProductId;
 const pending = placeholderShots(product);
 const zh = lang === 'zh';
 const archCaption = zh ? '架构示意（非截图）：应用只负责呈现与转达，Mojo Core 是唯一权威。' : 'Architecture diagram, not a screenshot: the apps render and forward, Mojo Core is the only authority.';
 const pendingBlock = pending.length ? `<div class="mojo-pending" data-reveal><div class="case-gallery-head"><h4>${zh ? '待补截图' : 'Screenshots still to come'}</h4><span>${zh ? '占位只说明将要展示的界面，不是产品画面。' : 'Placeholders describe the screen to be shown; they are not product images.'}</span></div><div class="mojo-pending-grid">${pending.map(s => placeholder(s, lang)).join('')}</div></div>` : '';
 return `<figure class="mojo-arch" data-reveal data-mojo-arch="${product}">${architectureSvg(product)}<figcaption>${esc(archCaption)}</figcaption></figure>${pendingBlock}`;
}

// ── Static product pages ──────────────────────────────────────────────────
// Split so the inlined single-file bundle never contains a literal external <script src> tag.
const SCRIPT_OPEN = '<' + 'script';
const LINK_OPEN = '<' + 'link';
type PageKey = MojoProductId | 'index' | 'roadmap' | 'security';
const NAV: {key: PageKey; label: string; href: string}[] = [
 {key: 'claw', label: 'MojoClaw', href: 'claw/'},
 {key: 'core', label: 'Mojo Core', href: 'core/'},
 {key: 'ax', label: 'MojoAX', href: 'ax/'},
 {key: 'roadmap', label: 'Roadmap', href: 'roadmap/'},
 {key: 'security', label: 'Privacy & safety', href: 'security/'}
];

function shell(key: PageKey, title: string, description: string, body: string): string {
 const depth = key === 'index' ? '' : '../';
 const nav = NAV.map(n => `<a href="${depth}${n.href}"${n.key === key ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');
 return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#121418"><meta name="description" content="${esc(description)}">
<title>${esc(title)}</title>
<link rel="icon" href="${depth}../assets/favicon.svg" type="image/svg+xml">${LINK_OPEN} rel="stylesheet" href="${depth}site.css">
${SCRIPT_OPEN} defer src="${depth}site.js"></script>
</head>
<body class="page-${key}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="wordmark" href="${depth || './'}" aria-label="Mojo product family"><span class="mark" aria-hidden="true">M</span><span>Mojo</span></a><nav aria-label="Product pages">${nav}</nav><a class="header-action" href="${depth}../">Portfolio <span aria-hidden="true">↗</span></a></header>
<main id="main">
${body}
</main>
<nav class="support-nav" aria-label="More"><a href="${depth || './'}">Mojo family</a><a href="${depth}roadmap/">Status &amp; roadmap</a><a href="${depth}security/">Privacy &amp; safety</a><a href="${depth}../#work">All projects</a></nav>
<footer class="site-footer"><p>Mojo is a private project by Mingzhe Zhang. Screenshots come from the running development build with navigation cropped; example projects only. No public download is offered.</p></footer>
</body>
</html>
`;
}

function productPage(page: MojoPage): string {
 const prefix = '../../';
 const hero = shotById(page.heroShot);
 const heroFigure = hero ? pageFigure(hero, prefix, true) : `<figure class="shot shot-planned-product hero-arch">${architectureSvg(page.id)}<figcaption><span>Architecture diagram</span>No runtime screenshots yet.</figcaption></figure>`;
 const caps = page.capabilities.map((cap, i) => {
  const shot = shotById(cap.shot);
  return `<article class="capability${shot ? ' has-shot' : ''}${i % 2 ? ' is-flipped' : ''}"><div class="capability-copy"><span class="capability-no">${String(i + 1).padStart(2, '0')}</span>${statusChip(cap.status)}<h3>${esc(cap.title)}</h3><p>${esc(cap.body)}</p></div>${pageFigure(shot, prefix)}</article>`;
 }).join('');
 const shots = shotsFor(page.id);
 const captured = shots.filter(s => s.status === 'captured').length;
 return shell(page.id, `${page.name} — ${page.titleLines.join(' ')}`, page.oneLiner, `
<section class="hero" aria-labelledby="hero-title">
 <div class="hero-copy"><p class="eyebrow">${esc(page.eyebrow)}</p><h1 id="hero-title">${page.titleLines.map(l => `<span>${esc(l)}</span>`).join('')}</h1>
 <div class="hero-intro"><p>${esc(page.oneLiner)}</p><p class="status-line">${statusChip(page.statusKind)}<span>${esc(page.statusLine)}</span></p><div class="hero-actions"><a class="button" href="#capabilities">See what it does <span aria-hidden="true">↓</span></a><a class="inline-link" href="../roadmap/#${page.id}">Status &amp; roadmap <span aria-hidden="true">↗</span></a></div></div></div>
 <div class="hero-stage">${heroFigure}</div>
</section>
<section class="section problems" aria-labelledby="problems-title"><h2 id="problems-title">Why it exists.</h2><div class="tile-grid">${page.problems.map(p => `<article><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></article>`).join('')}</div></section>
<section class="section" id="capabilities" aria-labelledby="cap-title"><div class="section-head"><h2 id="cap-title">What it does.</h2><p>Each item carries its real status. ${captured ? `${captured} of ${shots.length} screen${shots.length === 1 ? '' : 's'} on this page ${captured === 1 ? 'is' : 'are'} captured from the running app; the rest are labelled placeholders.` : 'Nothing on this page is a runtime capture; placeholders say what will be shown.'}</p></div>${caps}</section>
<section class="section architecture" aria-labelledby="arch-title"><div class="section-head"><h2 id="arch-title">How it fits together.</h2><p>${esc(page.architectureNote)}</p></div><figure class="arch-figure">${architectureSvg(page.id)}<figcaption>Diagram, not a screenshot.</figcaption></figure></section>
<section class="section" aria-labelledby="flow-title"><div class="section-head"><h2 id="flow-title">A typical run.</h2><p>An illustrative flow, not a recorded session.</p></div><ol class="flow">${page.workflow.map((s, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></li>`).join('')}</ol></section>
<section class="section safety" aria-labelledby="safety-title"><div class="section-head"><h2 id="safety-title">Privacy and safety.</h2><p><a class="inline-link" href="../security/">All principles <span aria-hidden="true">↗</span></a></p></div><div class="tile-grid">${page.safety.map(p => `<article><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></article>`).join('')}</div></section>
<section class="section" aria-labelledby="stack-title"><h2 id="stack-title">Built with.</h2><div class="stack-grid">${page.stack.map(g => `<div><h3>${esc(g.group)}</h3><ul>${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div></section>
<section class="section" aria-labelledby="road-title"><div class="section-head"><h2 id="road-title">Where it stands.</h2><p>Updated 18 October 2026. "Running in the dev build" means the owner's private deployment, not a public release.</p></div>${roadmapTable(page)}</section>
<section class="section questions" aria-labelledby="faq-title"><h2 id="faq-title">Questions.</h2><div class="question-list">${page.faq.map(f => `<details><summary>${esc(f.q)}<span aria-hidden="true">+</span></summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>
<section class="closing"><h2>${esc(page.closing)}</h2><div class="closing-actions">${MOJO_PRODUCTS.filter(id => id !== page.id).map(id => `<a class="inline-link" href="../${id}/">${esc(mojoPages[id].name)} <span aria-hidden="true">↗</span></a>`).join('')}</div></section>`);
}

function roadmapTable(page: MojoPage): string {
 return `<div class="roadmap" id="${page.id}"><table><thead><tr><th scope="col">Item</th><th scope="col">Status</th><th scope="col">Note</th></tr></thead><tbody>${page.roadmap.map(r => `<tr><td>${esc(r.item)}</td><td>${statusChip(r.status)}</td><td>${esc(r.note)}</td></tr>`).join('')}</tbody></table></div>`;
}

function indexPage(): string {
 const cards = MOJO_PRODUCTS.map(id => {
  const p = mojoPages[id];
  const hero = shotById(p.heroShot);
  return `<a class="product-card" href="${id}/"><span class="eyebrow">${esc(p.eyebrow)}</span><h2>${esc(p.name)}</h2><p>${esc(p.oneLiner)}</p><span class="status-line">${statusChip(p.statusKind)}</span>${hero && hero.status === 'captured' ? `<img src="../${esc(hero.file)}" width="${hero.width}" height="${hero.height}" alt="${esc(hero.alt.en)}" loading="lazy" decoding="async">` : ''}<span class="inline-link">Read more <span aria-hidden="true">↗</span></span></a>`;
 }).join('');
 return shell('index', 'Mojo — MojoClaw, Mojo Core and MojoAX', 'The Mojo product family: MojoClaw, a personal AI workbench; Mojo Core, the shared authority behind it; and MojoAX, the enterprise workbench.', `
<section class="hero hero-family" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">Mojo product family · by OpenAX</p><h1 id="hero-title"><span>Two workbenches.</span><span>One authority.</span></h1><div class="hero-intro"><p>MojoClaw is for individuals; MojoAX is for teams. Both run on Mojo Core, which owns models, permissions and run state so the apps can stay honest about what happened.</p></div></div></section>
<section class="section"><div class="product-grid">${cards}</div></section>
<section class="section architecture" aria-labelledby="arch-title"><div class="section-head"><h2 id="arch-title">How the pieces connect.</h2><p>Fairy, another project in this portfolio, has its own Core and is not part of this diagram.</p></div><figure class="arch-figure">${architectureSvg(null)}<figcaption>Diagram, not a screenshot.</figcaption></figure></section>`);
}

function roadmapPage(): string {
 return shell('roadmap', 'Mojo — Status & roadmap', 'Current status and roadmap of MojoClaw, Mojo Core and MojoAX.', `
<section class="docs"><p class="eyebrow">Status &amp; roadmap · 18 October 2026</p><h1>Where each product stands.</h1><p class="lead">Three labels, used strictly. <strong>Running in the dev build</strong>: in the owner's private deployment and used. <strong>In development</strong>: built behind a switch or in integration. <strong>Planned</strong>: designed or decided, not built.</p>
${MOJO_PRODUCTS.map(id => `<section class="docs-block"><h2><a href="../${id}/">${esc(mojoPages[id].name)}</a></h2>${roadmapTable(mojoPages[id])}</section>`).join('')}</section>`);
}

function securityPage(): string {
 return shell('security', 'Mojo — Privacy & safety', 'Privacy and safety principles of the Mojo products, and how this site handles screenshots.', `
<section class="docs"><p class="eyebrow">Privacy &amp; safety</p><h1>Strict, with few interruptions.</h1><p class="lead">Security may be strict, but confirmations must be rare. Every feature is designed against a confirmation budget: work inside the project proceeds on its own, and crossing a boundary asks once for that scope.</p>
${MOJO_PRODUCTS.map(id => `<section class="docs-block"><h2>${esc(mojoPages[id].name)}</h2>${mojoPages[id].safety.map(s => `<h3>${esc(s.title)}</h3><p>${esc(s.body)}</p>`).join('')}</section>`).join('')}
<section class="docs-block"><h2>About this site</h2><p>Screenshots were captured from the owner's development build. Navigation columns with conversation titles and the account are cropped out; projects shown are examples. Captures that still show an email address are not published until redacted. No analytics or trackers run on these pages.</p></section></section>`);
}

/** Every generated file, keyed by its path under public/mojo/. */
export function renderMojoSite(): Record<string, string> {
 svgSeq = 0;
 return {
  'index.html': indexPage(),
  'claw/index.html': productPage(mojoPages.claw),
  'core/index.html': productPage(mojoPages.core),
  'ax/index.html': productPage(mojoPages.ax),
  'roadmap/index.html': roadmapPage(),
  'security/index.html': securityPage()
 };
}
