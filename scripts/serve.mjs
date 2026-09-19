import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);const dirArg=args.indexOf('--dir');
const root=path.resolve(project,dirArg>=0?args[dirArg+1]:'preview');
const port=Number(process.env.PORT||8765);const prefix=process.env.PREFIX||'';
const mime={'.html':'text/html; charset=utf-8','.htm':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.ico':'image/x-icon','.mp4':'video/mp4','.webm':'video/webm','.mov':'video/quicktime','.mkv':'video/x-matroska','.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg','.pdf':'application/pdf','.woff2':'font/woff2','.woff':'font/woff','.txt':'text/plain; charset=utf-8','.wasm':'application/wasm','.map':'application/json; charset=utf-8'};
if(!fs.existsSync(path.join(root,'index.html'))){console.error('Preview files not found. Run npm run build:offline first.');process.exit(1)}
const server=http.createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method||'')){res.writeHead(405);res.end();return}
  let pathname=decodeURIComponent(new URL(req.url||'/',`http://127.0.0.1:${port}`).pathname);
  if(prefix){if(!pathname.startsWith(prefix+'/')&&pathname!==prefix){res.writeHead(404);res.end();return}pathname=pathname.slice(prefix.length)||'/'}
  const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return}
  const stat=fs.statSync(file);
  const base={'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
  // HTTP Range support (video/audio seeking); required for real media testing.
  const range=req.headers.range;
  if(range){
   const m=/^bytes=(\d*)-(\d*)$/.exec(range);
   if(!m){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return}
   let start=m[1]?Number(m[1]):0,end=m[2]?Number(m[2]):stat.size-1;
   if(m[1]===''&&m[2]){start=Math.max(0,stat.size-Number(m[2]));end=stat.size-1}
   if(start>end||start>=stat.size||end>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return}
   res.writeHead(206,{...base,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});
   if(req.method==='HEAD'){res.end();return}
   fs.createReadStream(file,{start,end}).pipe(res);return
  }
  res.writeHead(200,{...base,'Content-Length':stat.size});
  if(req.method==='HEAD'){res.end();return}fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request')}
});
server.listen(port,'127.0.0.1',()=>console.log(`Portfolio server: http://127.0.0.1:${port}${prefix}/\nServing ${root}\nPress Ctrl+C to stop.`));
server.on('error',e=>{console.error(e.message);process.exit(1)});
