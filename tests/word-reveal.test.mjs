import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {renderSite}from '../.test-build/views.js';
test('homepage opts into word reveal but not footer, controls or dialogs',()=>{
 const html=renderSite('en');assert.match(html,/<h1 data-word-reveal>/);
 assert.match(html,/class="hero-description" data-word-reveal/);
 assert.ok((html.match(/data-word-reveal/g)||[]).length>=6);
 assert.ok(!html.slice(html.indexOf('id="contact"')).includes('data-word-reveal'));
});
test('word controller module exists',()=>assert.ok(fs.existsSync('.test-build/word-reveal.js')));
if(fs.existsSync('.test-build/word-reveal.js')){
 const {splitWords}=await import('../.test-build/word-reveal.js');
 for(const [locale,input]of [['en','Let’s build  real AI.\nNow!'],['zh','用 AI 构建个人终端助手。'],['zh','AI 👩‍💻 配合工作'],['en','']])test('segmentation preserves complete original string '+input,()=>{
  const tokens=splitWords(input,locale);assert.equal(tokens.join(''),input);assert.ok(tokens.every(t=>t.length>0));
 });
 test('Latin words are kept whole',()=>assert.deepEqual(splitWords('AI applications.','en'),['AI',' ','applications.']));
}
