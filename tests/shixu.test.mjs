import test from 'node:test';
import assert from 'node:assert/strict';
import {projects} from '../.test-build/content.js';
import {renderSite, renderCase} from '../.test-build/views.js';
import {linksByKind, publicDemo, validateLinkRegistry} from '../.test-build/project-links.js';
import {gallery, coverFor, validateMediaRegistry} from '../.test-build/project-media.js';

test('Shixu is a single bilingual portfolio entry with stable visitor routes',()=>{
 const entries=projects.filter(p=>p.id==='shixu');
 assert.equal(entries.length,1);
 const links=linksByKind('shixu');
 assert.equal(links.website[0].url,'./shixu/');
 assert.equal(publicDemo('shixu').url,'./shixu/workbench/');
 assert.equal(links.download[0].url,'./shixu/download/');
 assert.equal(links.source.length,0);
 assert.deepEqual(validateLinkRegistry(),[]);
 assert.deepEqual(validateMediaRegistry(),[]);
 assert.equal(coverFor('shixu').src,'./shixu/assets/today.jpg');
 assert.equal(gallery('shixu').length,4);
 for(const lang of ['en','zh']){
  const page=renderSite(lang);
  assert.equal((page.match(/data-project-card="shixu"/g)||[]).length,1);
  assert.equal((page.match(/class="shixu-launch"/g)||[]).length,0);
  assert.match(page,/data-case="shixu"/);
  const detail=renderCase(entries[0],lang);
  assert.match(detail,/data-shixu-preview/);
  assert.match(detail,/src=".\/shixu\/workbench\//);
  assert.ok(detail.includes(lang==='zh'?'本地规则':'local rules'));
  assert.ok(detail.includes(lang==='zh'?'Windows 专属':'Windows-only'));
  assert.ok(!detail.includes('Shixu-WinUI3'));
 }
});

test('single-file edition keeps Shixu content without external embedded assets',()=>{
 const html=renderSite('en',{singleFile:true});
 assert.match(html,/data-project-card="shixu"/);
 assert.ok(!html.includes('src="./shixu/assets/'));
});
