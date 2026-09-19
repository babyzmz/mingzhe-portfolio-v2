import {test,before,after} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawn} from 'node:child_process';
const root=path.join(os.tmpdir(),'portfolio-serve-range-'+process.pid);
const port=8799;
let server;
before(async()=>{
 fs.rmSync(root,{recursive:true,force:true});
 fs.mkdirSync(path.join(root,'media','fairy'),{recursive:true});
 fs.writeFileSync(path.join(root,'index.html'),'<!doctype html><title>x</title>');
 fs.writeFileSync(path.join(root,'media','fairy','sample.mp4'),Buffer.alloc(100000,7));
 await new Promise((res,rej)=>{
  server=spawn(process.execPath,[path.resolve('scripts/serve.mjs'),'--dir',root],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
  server.stdout.on('data',d=>{if(String(d).includes('Portfolio server'))res()});
  server.on('error',rej);setTimeout(res,3000);
 });
});
after(()=>{try{server.kill()}catch{};fs.rmSync(root,{recursive:true,force:true})});
const get=(p,headers={})=>fetch(`http://127.0.0.1:${port}${p}`,{headers});
test('serves video with mp4 mime and advertises Accept-Ranges',async()=>{
 const r=await get('/media/fairy/sample.mp4',{Range:'bytes=0-999'});
 assert.equal(r.status,206);
 assert.match(r.headers.get('content-type'),/video\/mp4/);
 assert.equal(r.headers.get('accept-ranges'),'bytes');
 assert.equal(r.headers.get('content-range'),'bytes 0-999/100000');
 assert.equal(r.headers.get('content-length'),'1000');
 const buf=Buffer.from(await r.arrayBuffer());assert.equal(buf.length,1000);
});
test('open-ended and suffix ranges work for seeking',async()=>{
 const r1=await get('/media/fairy/sample.mp4',{Range:'bytes=99000-'});
 assert.equal(r1.status,206);assert.equal(r1.headers.get('content-range'),'bytes 99000-99999/100000');
 const r2=await get('/media/fairy/sample.mp4',{Range:'bytes=-500'});
 assert.equal(r2.status,206);assert.equal(r2.headers.get('content-range'),'bytes 99500-99999/100000');
 assert.equal(r2.headers.get('content-length'),'500');
});
test('unsatisfiable range returns 416',async()=>{
 const r=await get('/media/fairy/sample.mp4',{Range:'bytes=200000-'});
 assert.equal(r.status,416);assert.match(r.headers.get('content-range')||'',/bytes \*\//);
});
test('path traversal is rejected',async()=>{
 const r=await get('/../../package.json');
 assert.equal(r.status,404);
});
