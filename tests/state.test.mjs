import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('camera module exists before exercising real behaviour', () => assert.ok(fs.existsSync('.test-build/state.js'), 'camera implementation is not present'));
if(fs.existsSync('.test-build/state.js')) {
 const { sampleCamera, normaliseLocale, progressAtScroll } = await import('../.test-build/state.js');
 test('camera translates in depth through all five stations',()=>{
  const zs = Array.from({length:81},(_,i)=>sampleCamera(i/20).position[2]);
  assert.ok(zs[0]-zs.at(-1)>50);
  zs.forEach((z,i)=>{if(i) assert.ok(z<=zs[i-1])});
 });
 test('camera path is deterministic in reverse',()=>{
  for (const t of [0,.25,1,1.6,2,2.8,3.4,4]) {
   const pose=sampleCamera(t); sampleCamera(4); assert.deepEqual(sampleCamera(t),pose);
   assert.ok([...pose.position,...pose.target].every(Number.isFinite));
  }
 });
 test('progress clamps extreme input and locale never accepts arbitrary markup',()=>{
  assert.deepEqual(sampleCamera(-1),sampleCamera(0));
  assert.deepEqual(sampleCamera(10),sampleCamera(4));
  assert.equal(normaliseLocale('zh'),'zh'); assert.equal(normaliseLocale('<script>'),'en');
 });
 test('section progress can be restored at a deep scroll position',()=>{
  assert.equal(progressAtScroll(-10,[0,100,200,300,400]),0);
  assert.equal(progressAtScroll(240,[0,100,200,300,400]),2.4);
  assert.equal(progressAtScroll(999,[0,100,200,300,400]),4);
 });
}
