import fs from 'node:fs';
import path from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
const require=createRequire(import.meta.url);let ts;
try{ts=require('typescript')}catch{const globalRoot=execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim();ts=require(path.join(globalRoot,'typescript'))}
const tscPath=require.resolve?(()=>{try{return require.resolve('typescript/bin/tsc')}catch{return path.join(execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript/bin/tsc')}})():'';
fs.rmSync('preview',{recursive:true,force:true});fs.mkdirSync('preview',{recursive:true});
const compiled=spawnSync(process.execPath,[tscPath,'-p','tsconfig.offline.json','--outDir','preview/app'],{stdio:'inherit'});if(compiled.status!==0)process.exit(compiled.status||1);
// Recursive copy built from plain readdir/mkdir/copyFile: Node 22.23's native
// fs.cpSync(...,{recursive:true}) crashes (0xC0000409) on this Windows host for
// ordinary directories. This helper has no native directory-copy path.
function copyTree(from,to){
 fs.mkdirSync(to,{recursive:true});
 for(const entry of fs.readdirSync(from,{withFileTypes:true})){
  const s=path.join(from,entry.name),d=path.join(to,entry.name);
  if(entry.isDirectory())copyTree(s,d);
  else if(entry.isFile())fs.copyFileSync(s,d);
 }
}
copyTree('styles','preview/styles');copyTree('public','preview');
const {renderSite}=await import(pathToFileURL(path.join(root,'preview/app/views.js')).href+'?build='+Date.now());
let html=fs.readFileSync('index.html','utf8').replace('<!--APP-->',renderSite('en')).replace('./src/main.ts','./app/main.js');
fs.writeFileSync('preview/index.html',html);fs.writeFileSync('preview/.nojekyll','');
// Genuine offline, file:// runnable edition. Compile each TS module to CommonJS
// and use a small local module loader. Missing optional GSAP imports are caught
// by gsap-adapter and select the documented native scroll backend.
const modules=[];
for(const file of fs.readdirSync('src').filter(f=>f.endsWith('.ts')&&!f.endsWith('.d.ts'))){
 const result=ts.transpileModule(fs.readFileSync('src/'+file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}});
 modules.push(JSON.stringify(file.replace(/\.ts$/,'.js'))+': function(require,module,exports){\n'+result.outputText+'\n}');
}
let bundle=`(()=>{const modules={${modules.join(',\n')}};const cache={};function load(id){if(id.startsWith('./'))id=id.slice(2);if(cache[id])return cache[id].exports;if(!modules[id])throw new Error('Optional dependency not bundled: '+id);const module={exports:{}};cache[id]=module;modules[id](load,module,module.exports);return module.exports;}load('main.js');})();`;
const pdf='data:application/pdf;base64,'+fs.readFileSync('public/documents/Mingzhe_Zhang_AI_Developer_Resume.pdf').toString('base64');
bundle=bundle.replaceAll('./documents/Mingzhe_Zhang_AI_Developer_Resume.pdf',pdf);
html=html.replace(/<link rel="stylesheet" href="\.\/styles\/([^\"]+)">/g,(_,f)=>`<style>${fs.readFileSync('styles/'+f,'utf8')}</style>`);
html=html.replace('<script type="module" src="./app/main.js"></script>','<script>window.__PORTFOLIO_SINGLE_FILE__=true</script><script>'+bundle.replaceAll('</script','<\\/script')+'</script>');
html=html.replaceAll('./documents/Mingzhe_Zhang_AI_Developer_Resume.pdf',pdf).replace('./assets/favicon.svg','data:image/svg+xml;base64,'+fs.readFileSync('public/assets/favicon.svg').toString('base64'));
fs.writeFileSync('Mingzhe-Portfolio-Preview.html',html);
console.log('Built preview/ and standalone Mingzhe-Portfolio-Preview.html. No network dependencies required.');
