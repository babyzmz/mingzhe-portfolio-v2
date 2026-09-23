import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {profile,projects,text} from '../.test-build/content.js';
import {aiCases} from '../.test-build/case-ai-content.js';
import {archiveCases} from '../.test-build/case-archive-content.js';
import {caseLabels} from '../.test-build/case-labels.js';
import {projectLinks} from '../.test-build/project-links.js';
import {projectMedia} from '../.test-build/project-media.js';
const value=structuredClone({profile,projects,text,aiCases,archiveCases,caseLabels,links:projectLinks,media:projectMedia});
// Only the owner's new positioning and the misplaced stream labels may differ.
for(const p of value.projects)if(['fairy','claw'].includes(p.id))for(const l of ['en','zh']){delete p[l].category;delete p[l].summary;}
for(const id of ['fairy','claw'])for(const l of ['en','zh'])for(const k of ['tagline','purpose'])delete value.aiCases[id][l][k];
for(const l of ['en','zh'])for(const k of ['fairyDesc','clawLabel','mojoDesc','streamPrefix','streamItems'])delete value.text[l][k];
function norm(v){return Array.isArray(v)?v.map(norm):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v;}
const hashes=JSON.parse(fs.readFileSync(new URL('./fixtures/local-upload-hashes.json',import.meta.url)));
for(const [key,data]of Object.entries(value))test(`local upload ${key} retained without unrelated changes`,()=>assert.equal(createHash('sha256').update(JSON.stringify(norm(data))).digest('hex'),hashes[key],key+' diverges from the owner-uploaded build'));
test('positioning is consistent and remains separate from release status',()=>{
 const fairy=projects.find(p=>p.id==='fairy'),claw=projects.find(p=>p.id==='claw');
 assert.match(fairy.zh.summary,/个人终端/);assert.match(fairy.zh.summary,/目标/);
 assert.match(fairy.en.summary,/personal devices/i);
 for(const l of ['en','zh']){assert.match(claw[l].summary,/SaaS/);assert.match(aiCases.claw[l].tagline,/SaaS/);}
 assert.match(claw.zh.summary,/网页.*桌面/);assert.match(claw.en.summary,/web.*desktop/i);
 assert.match(fairy.en.status,/development/);assert.match(claw.en.status,/development/);
});
