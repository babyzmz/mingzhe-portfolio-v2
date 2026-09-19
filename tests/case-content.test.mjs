import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { projects } from '../.test-build/content.js';
import { renderCase } from '../.test-build/views.js';
const available = fs.existsSync('.test-build/case-content.js');
test('detailed case-study content exists',()=>assert.ok(available,'Missing source-grounded case study module'));
if (available) {
 const { caseStudies } = await import('../.test-build/case-content.js');
 test('all nine projects have substantive bilingual case content',()=>{
  assert.equal(Object.keys(caseStudies).length,9);
  for (const p of projects) for (const lang of ['zh','en']) {
   const c=caseStudies[p.id][lang];
   for (const k of ['tagline','purpose','audience','scenario','workflowNote','development','relationship']) assert.ok(c[k]?.length>12,p.id+':'+lang+':'+k);
   assert.ok(c.workflow.length>=3); assert.ok(c.capabilities.length>=3); assert.ok(c.terms.length>=2);
   const html=renderCase(p,lang);
   for(const id of ['overview','workflow','features','build','evidence']) assert.ok(html.includes(`data-case-section="${id}"`),p.id+': missing '+id);
   assert.ok(html.includes('data-case-jump="workflow"'));
   assert.ok(html.includes('data-glossary-toggle'));
  }
 });
 test('illustrations and historical gaps are never described as verified demos',()=>{
  for (const p of projects) for(const lang of ['zh','en']) {
   const c=caseStudies[p.id][lang];
   assert.ok(c.workflowNote.includes(lang==='zh'?'示意':'illustrat'));
   if(p.kind==='archive') assert.ok(c.development.includes(lang==='zh'?'未':'not'));
  }
  assert.match(caseStudies.core.zh.relationship,/Fairy/);
  assert.match(caseStudies.core.en.relationship,/own Core/);
 });
}
