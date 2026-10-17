import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {mojoShots, capturedShots, validateMojoShots} from '../.test-build/mojo-shots.js';
import {mojoPages, mojoCases} from '../.test-build/mojo-content.js';
import {renderMojoSite} from '../.test-build/mojo-view.js';
import {projects} from '../.test-build/content.js';
import {renderCase} from '../.test-build/views.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = renderMojoSite();

test('shot manifest is valid and captured files exist', () => {
 assert.deepEqual(validateMojoShots(), []);
 for (const shot of capturedShots()) assert.ok(fs.existsSync(path.join(root, 'public', shot.file)), `missing ${shot.file}`);
 assert.equal(capturedShots('ax').length, 0, 'MojoAX has no runtime capture yet');
 for (const id of ['claw', 'core']) {
  const hero = mojoShots.find(s => s.id === mojoPages[id].heroShot);
  assert.equal(hero?.status, 'captured', `${id} hero is a real capture`);
 }
});

test('generated product pages in public/mojo are up to date', () => {
 for (const [rel, html] of Object.entries(site)) {
  const file = path.join(root, 'public/mojo', rel);
  assert.ok(fs.existsSync(file), `missing public/mojo/${rel}; run npm run build:mojo`);
  // Line endings are normalised: Windows checkouts may convert LF to CRLF.
  assert.equal(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'), html, `stale public/mojo/${rel}; run npm run build:mojo`);
  assert.ok(!html.includes('\r'), `generator output for ${rel} must be LF-only`);
 }
});

test('product pages are English and complete', () => {
 for (const id of ['claw', 'core', 'ax']) {
  const html = site[`${id}/index.html`];
  assert.match(html, /<html lang="en">/);
  for (const marker of ['id="capabilities"', 'class="arch-svg"', 'class="flow"', 'id="safety-title"', 'id="stack-title"', 'class="roadmap"', 'class="question-list"']) assert.ok(html.includes(marker), `${id}: ${marker}`);
  const visible = html.replace(/<[^>]+>/g, ' ');
  assert.ok(!/[一-鿿]/.test(visible), `${id}: page text must be English`);
 }
 assert.ok(site['ax/index.html'].includes('status-progress'));
 assert.equal(mojoPages.ax.statusKind, 'progress');
});

test('pending shots render as placeholders, never as image requests', () => {
 const all = Object.values(site).join('\n');
 for (const shot of mojoShots) {
  const asImg = all.includes(`src="../../${shot.file}"`) || all.includes(`src="../${shot.file}"`);
  if (shot.status === 'captured') continue;
  assert.ok(!asImg, `${shot.id} is not captured but is requested as an image`);
 }
 for (const p of projects.filter(p => ['claw', 'core', 'ax'].includes(p.id))) for (const lang of ['en', 'zh']) {
  const html = renderCase(p, lang);
  for (const shot of mojoShots.filter(s => s.product === p.id && s.status !== 'captured')) assert.ok(!html.includes(`src="./${shot.file}"`), shot.id);
  assert.match(html, /data-mojo-arch=/);
  assert.ok(html.includes(`href="./mojo/${p.id}/"`), `${p.id} links its product page`);
 }
});

test('every relative link in the product pages resolves', () => {
 for (const [rel, html] of Object.entries(site)) {
  const dir = path.posix.dirname(path.posix.join('mojo', rel));
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
   const ref = m[1];
   if (/^(https?:|mailto:|#)/.test(ref)) continue;
   const target = path.posix.normalize(path.posix.join(dir, ref.split('#')[0]));
   const rootIndex = target === '.' || target === './' || target === '';
   const file = rootIndex ? path.join(root, 'index.html') : path.join(root, 'public', target.endsWith('/') ? target + 'index.html' : target);
   assert.ok(fs.existsSync(file), `${rel}: broken link ${ref}`);
  }
 }
});

test('public Mojo copy carries no private details', () => {
 const text = Object.values(site).join('\n') + JSON.stringify({mojoPages, mojoCases, mojoShots});
 for (const bad of [/localhost/i, /127\.0\.0\.1/, /handoff-private/, /\/Users\//, /openax\.au/i, /\.worktrees/, /MOJO_CORE_[A-Z_]+/]) assert.ok(!bad.test(text), `forbidden: ${bad}`);
});

test('the shot list document covers every manifest entry', () => {
 const doc = fs.readFileSync(path.join(root, 'docs/handoff/MOJO_SCREENSHOT_SHOTLIST.md'), 'utf8');
 for (const shot of mojoShots) assert.ok(doc.includes('`' + shot.file + '`'), `shot list misses ${shot.file}`);
});

test('non-public details and retired wording stay out of every Mojo surface', () => {
 const doc = fs.readFileSync(path.join(root, 'docs/handoff/MOJO_SCREENSHOT_SHOTLIST.md'), 'utf8');
 const mojoProjects = projects.filter(p => ['claw', 'core', 'ax'].includes(p.id));
 const reader = mojoProjects.flatMap(p => ['en', 'zh'].map(lang => renderCase(p, lang))).join('\n');
 const text = [Object.values(site).join('\n'), JSON.stringify({mojoPages, mojoCases, mojoShots, mojoProjects}), reader, doc].join('\n');
 const banned = [/MiMo/i, /DeepSeek/i, /\bGLM\b/i, /author'?s machine/i, /owner'?s (own )?machine/i, /own machine/i, /作者本机/, /acceptance run/i, /自动化验收/, /\bpaused\b/i, /on hold/i, /暂停/, /allowlist/i, /白名单/, /MojoCore/];
 for (const re of banned) assert.ok(!re.test(text), `forbidden wording: ${re}`);
});
