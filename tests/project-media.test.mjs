import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
 projectMedia, mediaFor, approvedMedia, gallery, coverFor, hasRealEvidence,
 validateProjectMedia, validateMediaRegistry
} from '../.test-build/project-media.js';
import {gallerySection,coverFigure} from '../.test-build/media-view.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FLAG = '__PORTFOLIO_TEST_MEDIA__';
function useFixture(items) { globalThis[FLAG] = items; }
function clearFixture() { delete globalThis[FLAG]; }
test.beforeEach(clearFixture);
test.afterEach(clearFixture);

const base = {
 width: 1280, height: 800,
 alt: {en: 'Desktop window', zh: '桌面窗口'},
 caption: {en: 'Chat workspace', zh: '聊天工作区'},
 provenance: {en: 'Native window capture', zh: '原生窗口截图'},
 capturedAt: '2026-09-18T10:00:00.000Z',
 versionLabel: 'fairy-v3 @ bb309157',
 claimIds: ['chat'],
};
const shot = {...base, id: 'shot1', projectId: 'fairy', type: 'screenshot',
 src: './media/fairy/shot1.webp', evidenceKind: 'runtime-recorded', publication: 'approved'};
const shot2 = {...base, id: 'shot2', projectId: 'fairy', type: 'screenshot',
 src: './media/fairy/shot2.webp', evidenceKind: 'runtime-recorded', publication: 'approved',
 width: 800, height: 600};
const withheld = {...base, id: 'shot3', projectId: 'fairy', type: 'screenshot',
 src: './media/fairy/shot3.webp', evidenceKind: 'owner-supplied', publication: 'withheld'};
const clip = {...base, id: 'clip1', projectId: 'fairy', type: 'video',
 src: './media/fairy/clip1.mp4', poster: './media/fairy/clip1-poster.webp',
 evidenceKind: 'runtime-recorded', publication: 'approved'};
const diagram = {...base, id: 'diagram1', projectId: 'core', type: 'diagram',
 src: './media/core/diagram1.svg', evidenceKind: 'illustrative',
 capturedAt: null, versionLabel: null, claimIds: []};

test('production registry holds reviewed, validated evidence and never fabricates Mojo media', () => {
 assert.ok(projectMedia.length > 0, 'real captures were approved and registered');
 assert.deepEqual(validateMediaRegistry(), []);
 for (const id of ['core', 'claw', 'ax']) {
  assert.equal(mediaFor(id).length, 0, `${id} keeps labelled illustrations only until source is found`);
  assert.equal(coverFor(id), null);
 }
 for (const id of ['fairy', 'dreambound', 'converter', 'tarot', 'webchange', 'goodnight']) {
  assert.ok(coverFor(id), `${id} has a real cover`);
  assert.equal(hasRealEvidence(id), true);
 }
});

test('every registered media file exists in public/media', () => {
 for (const item of projectMedia) {
  for (const key of ['src', 'poster']) {
   if (!item[key]) continue;
   const rel = item[key].replace(/^\.\//, '');
   const file = path.join(root, 'public', rel);
   assert.ok(fs.existsSync(file), `missing public file for ${item.projectId}/${item.id}: ${rel}`);
  }
 }
});

test('valid media items pass validation', () => {
 assert.deepEqual(validateProjectMedia(shot), []);
 assert.deepEqual(validateProjectMedia(clip), []);
 assert.deepEqual(validateProjectMedia(diagram), []);
});

test('approved screenshot is selected as cover; withheld and other types are not', () => {
 useFixture([withheld, clip, diagram, shot]);
 assert.equal(coverFor('fairy')?.id, 'shot1', 'first approved screenshot wins over video/withheld');
 useFixture([withheld, clip, diagram, shot, shot2]);
 assert.equal(coverFor('fairy')?.id, 'shot1', 'selection is stable, not newest-file based');
});

test('withheld media never appears in public selection', () => {
 useFixture([withheld, shot]);
 assert.equal(approvedMedia('fairy').some(m => m.id === 'shot3'), false);
 assert.equal(gallery('fairy').some(m => m.id === 'shot3'), false);
});

test('gallery orders screenshots before video', () => {
 useFixture([clip, shot]);
 const ids = gallery('fairy').map(m => m.type);
 assert.deepEqual(ids, ['screenshot', 'video']);
});

test('media is scoped per project', () => {
 useFixture([shot]);
 assert.equal(mediaFor('core').length, 0);
 assert.equal(coverFor('core'), null);
});

test('invalid media is rejected by the validation gate', () => {
 const badSrc = {...shot, id: 'badsrc', src: 'file:///C:/secret.png'};
 assert.ok(validateProjectMedia(badSrc).some(i => i.includes('protocol')));
 const traversal = {...shot, id: 'trav', src: './media/../../.env'};
 assert.ok(validateProjectMedia(traversal).some(i => i.includes('traversal')));
 const localhost = {...shot, id: 'local', src: 'http://127.0.0.1/x.png'};
 assert.ok(validateProjectMedia(localhost).length > 0);
 const noDims = {...shot, id: 'nodims', width: 0, height: 800};
 assert.ok(validateProjectMedia(noDims).some(i => i.includes('width')));
 const noZh = {...shot, id: 'nozh', caption: {en: 'x', zh: ''}};
 assert.ok(validateProjectMedia(noZh).some(i => i.includes('caption')));
 const videoNoPoster = {...clip, id: 'vnp', poster: undefined};
 assert.ok(validateProjectMedia(videoNoPoster).some(i => i.includes('poster')));
 const runtimeNoMeta = {...shot, id: 'rnm', capturedAt: null, versionLabel: null};
 assert.ok(validateProjectMedia(runtimeNoMeta).join(' ').includes('capture-date'));
 const unknown = {...shot, id: 'unk', projectId: 'hack'};
 assert.ok(validateProjectMedia(unknown).some(i => i.includes('unknown-project')));
});

test('cover figure renders real img with dimensions and evidence, not the CSS illustration', () => {
 const html = coverFigure(shot, 'en');
 assert.match(html, /<img /);
 assert.match(html, /width="1280"/);
 assert.match(html, /height="800"/);
 assert.match(html, /data-cover-media="shot1"/);
 assert.match(html, /Recorded from the running program/);
});

test('gallery html keeps videos non-autoplaying with poster and controls', () => {
 const html = gallerySection([shot, clip], 'zh');
 assert.match(html, /data-media-gallery/);
 const video = html.slice(html.indexOf('<video'));
 assert.match(video, /preload="none"/);
 assert.match(video, /controls/);
 assert.match(video, /playsinline/);
 assert.match(video, /poster="\.\/media\/fairy\/clip1-poster\.webp"/);
 assert.doesNotMatch(video.slice(0, video.indexOf('></video>')), /autoplay/);
 assert.match(html, /视频不会自动播放/);
});

test('empty gallery renders nothing', () => {
 assert.equal(gallerySection([], 'zh'), '');
});
