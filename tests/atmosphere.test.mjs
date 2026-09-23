import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderSite} from '../.test-build/views.js';
for(const locale of ['en','zh']) test(`atmosphere structure without duplicated content ${locale}`,()=>{
 const html=renderSite(locale);
 assert.equal((html.match(/data-circular-mark/g)||[]).length,1);
 assert.equal((html.match(/data-card-light/g)||[]).length,9);
 assert.equal((html.match(/data-contact-stream(?:\s|>)/g)||[]).length,1);
 assert.equal((html.match(/data-project-card=/g)||[]).length,9);
 assert.ok(!html.includes('Systems in</'));
});
test('single background host is outside locale-replaced site',()=>{
 const h=fs.readFileSync('index.html','utf8');
 assert.equal((h.match(/id="atmosphere-canvas"/g)||[]).length,1);
 assert.ok(h.indexOf('id="atmosphere-canvas"')<h.indexOf('id="site"'));
});
test('interaction and background modules exist',async()=>{
 assert.ok(fs.existsSync('src/card-light.ts'));
 assert.ok(fs.existsSync('src/atmosphere.ts'));
 const {lightCoordinates}=await import('../.test-build/card-light.js');
 assert.deepEqual(lightCoordinates(100,80,200,160),{x:100,y:80,edge:0,angle:0});
 assert.equal(lightCoordinates(200,80,200,160).edge,1);
 assert.equal(lightCoordinates(100,0,200,160).angle,0);
 assert.equal(lightCoordinates(200,80,200,160).angle,90);
 for(const n of Object.values(lightCoordinates(NaN,Infinity,0,0)))assert.ok(Number.isFinite(n));
});
