import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const standalone=()=>fs.readFileSync('Mingzhe-Portfolio-Preview.html','utf8');
test('offline bundled JavaScript parses as an actual classic script',()=>{
 const html=standalone();
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 assert.ok(scripts.length>=1,'standalone has inline scripts');
 const bundle=scripts.sort((a,b)=>b.length-a.length)[0];
 assert.ok(bundle.length>50000,'main application bundle is inlined');
 assert.doesNotThrow(()=>new vm.Script(bundle));
});
test('offline edition has no network script or stylesheet requirements',()=>{
 const html=standalone();assert.ok(!/<script[^>]+src=/.test(html));assert.ok(!/<link[^>]+rel="stylesheet"/.test(html));assert.ok(html.includes('data:application/pdf;base64,'));
});
test('standalone edition flags itself so real media is gated out',()=>{
 const html=standalone();
 assert.ok(html.includes('window.__PORTFOLIO_SINGLE_FILE__=true'),'single-file flag present');
 assert.ok(!/(?:src|href)="(?:\.)?\/?media\//.test(html),'standalone never references external media files');
});
test('static preview edition does not set the single-file flag',()=>{
 const html=fs.readFileSync('preview/index.html','utf8');
 assert.ok(!html.includes('__PORTFOLIO_SINGLE_FILE__'),'static edition keeps media enabled');
});
