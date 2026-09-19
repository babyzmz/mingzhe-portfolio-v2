import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('project content module exists',()=>assert.ok(fs.existsSync('.test-build/content.js'),'verified content not implemented'));
if(fs.existsSync('.test-build/content.js')) {
 const {projects,profile} = await import('../.test-build/content.js');
 test('four flagship and five original projects are retained',()=>{
  assert.equal(projects.length,9); assert.equal(new Set(projects.map(p=>p.id)).size,9);
  for(const id of ['fairy','core','claw','ax','dreambound','webchange','goodnight','tarot','converter'])assert.ok(projects.some(p=>p.id===id));
 });
 test('all cases have complete bilingual evidence and contribution scope',()=>{
  for(const p of projects) for(const lang of ['en','zh']) for(const key of ['summary','role','status','evidence','limits']) assert.ok(p[lang][key]?.length>5,`${p.id} ${lang} ${key}`);
 });
 test('private project sources are not exported as public source links',()=>{
  for(const p of projects.filter(p=>['core','claw','ax'].includes(p.id))) assert.equal(p.url,null);
  assert.equal(profile.email,'zmz1998@gmail.com');
  assert.ok(!JSON.stringify(profile).includes('Springvale'));
 });
}
