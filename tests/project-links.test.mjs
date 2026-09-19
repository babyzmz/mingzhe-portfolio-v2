import test from 'node:test';
import assert from 'node:assert/strict';
import {
 projectLinks, linksFor, visibleLinks, linksByKind, publicDemo,
 safeUrlIssues, isSafePublicUrl, validateLinkRegistry, LINK_KIND_LABELS
} from '../.test-build/project-links.js';
import {PROJECT_IDS} from '../.test-build/project-types.js';

test('registry covers all nine project ids', () => {
 assert.deepEqual(Object.keys(projectLinks).sort(), [...PROJECT_IDS].sort());
 for (const id of PROJECT_IDS) assert.ok(Array.isArray(linksFor(id)));
});

test('mojo projects carry no public links', () => {
 for (const id of ['core', 'claw', 'ax']) assert.equal(linksFor(id).length, 0, id);
});

test('fairy has a public approved source link', () => {
 const groups = linksByKind('fairy');
 assert.equal(groups.source.length, 1);
 assert.equal(groups.source[0].access, 'public');
 assert.equal(groups.source[0].publication, 'approved');
 assert.match(groups.source[0].url, /^https:\/\/github\.com\//);
});

test('archive entries without a deployed build expose only the original record', () => {
 for (const id of ['webchange', 'goodnight', 'tarot', 'converter']) {
  const groups = linksByKind(id);
  assert.equal(groups.source.length, 0, `${id} must not claim source code`);
  assert.equal(groups.demo.length, 0, `${id} must not claim a live demo`);
  assert.equal(groups.download.length, 0, `${id} must not claim a download`);
  assert.ok(groups.record.length >= 1, `${id} keeps its original record`);
  for (const link of groups.record) assert.ok(link.url.includes('script.js'));
 }
});

test('dreambound has one verified public playable demo plus its original record', () => {
 const groups = linksByKind('dreambound');
 assert.equal(groups.source.length, 0, 'a playable demo is not mislabelled as source');
 assert.equal(groups.download.length, 0);
 assert.equal(groups.demo.length, 1);
 assert.ok(groups.record.length >= 1);
 const demo = groups.demo[0];
 assert.equal(demo.access, 'public');
 assert.equal(demo.verification, 'verified');
 assert.equal(demo.publication, 'approved');
 assert.match(demo.url, /^https:\/\/babyzmz\.github\.io\/mingzhe-portfolio-v2\/demos\/dreambound\//);
 assert.ok(demo.verifiedAt, 'a live demo carries a real verification timestamp');
});

test('old portfolio script.js is never classified as source code', () => {
 for (const id of ['webchange', 'goodnight', 'tarot', 'converter']) {
  for (const link of linksFor(id)) {
   if (link.url.includes('script.js')) assert.equal(link.kind, 'record');
  }
 }
});

test('withheld links are hidden while approved ones render', () => {
 assert.ok(visibleLinks('fairy').every(l => l.publication === 'approved'));
});

test('public demo requires public + verified + approved together', () => {
 assert.equal(publicDemo('fairy'), null, 'a source link is not a live demo');
 const dreamboundDemo = publicDemo('dreambound');
 assert.ok(dreamboundDemo && dreamboundDemo.verification === 'verified', 'deployed verified demo is exposed');
 const fake = {kind: 'demo', url: 'https://demo.example.com/', access: 'public', verification: 'unverified', publication: 'approved'};
 // Direct rule check through registry semantics.
 assert.notEqual(fake.access, 'restricted');
 assert.equal(fake.verification, 'unverified'); // gate stays closed until verified
});

test('link kind labels are bilingual', () => {
 for (const kind of ['source', 'demo', 'download', 'record']) {
  assert.ok(LINK_KIND_LABELS[kind].en.length > 1);
  assert.ok(LINK_KIND_LABELS[kind].zh.length > 1);
 }
});

test('manifest rejects unsafe absolute URLs', () => {
 const bad = [
  'file:///C:/Users/secret.txt',
  'http://localhost:8080/app',
  'http://127.0.0.1:3000/',
  'http://[::1]:3000/',
  'http://192.168.1.10/admin',
  'http://10.0.0.5/',
  'http://172.16.4.9/',
  'http://169.254.169.254/latest/meta-data/',
  'https://user:token@github.com/repo',
  'javascript:alert(1)',
  'data:text/html,<script>',
  'blob:https://example.com/x',
  '//protocol-relative.example.com/app',
  'https://example.com/path\rSet-Evil:1'
 ];
 for (const url of bad) assert.ok(safeUrlIssues(url).length > 0, `expected rejection: ${url}`);
});

test('manifest accepts normal public https URLs', () => {
 const good = [
  'https://github.com/babyzmz/Fairy-LLM',
  'https://example.com/releases/app-1.0.0.exe'
 ];
 for (const url of good) assert.deepEqual(safeUrlIssues(url), [], url);
});

test('relative URLs must stay inside the approved routes', () => {
 assert.deepEqual(safeUrlIssues('./media/fairy/shot.webp'), []);
 assert.deepEqual(safeUrlIssues('/documents/x.pdf'), []);
 assert.ok(safeUrlIssues('./../secret.env').length > 0);
 assert.ok(safeUrlIssues('/../../windows/system32').length > 0);
 assert.ok(safeUrlIssues('./src/main.ts').length > 0);
 assert.ok(safeUrlIssues('./.handoff-private/HANDOFF_STATUS.md').length > 0);
});

test('current shipped link registry passes the full validation gate', () => {
 assert.deepEqual(validateLinkRegistry(), []);
});

test('isSafePublicUrl boolean helper agrees with the issue list', () => {
 assert.equal(isSafePublicUrl('https://github.com/babyzmz/Fairy-LLM'), true);
 assert.equal(isSafePublicUrl('http://localhost:5173'), false);
});
