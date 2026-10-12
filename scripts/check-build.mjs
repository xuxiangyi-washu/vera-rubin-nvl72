import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.pdf':'application/pdf','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
// 本地模拟双入口；只为这个应用映射静态文件，缺失资源不回退为首页。
export function previewServer(){return http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 let relative=pathname.startsWith('/vera-rubin-nvl72/')?pathname.slice('/vera-rubin-nvl72/'.length):pathname==='/vera-rubin-nvl72'?'index.html':pathname.slice(1);
 if(!relative)relative='index.html';
 const file=path.resolve(dist,relative);
 if(!file.startsWith(dist)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]??'application/octet-stream'});fs.createReadStream(file).pipe(res);
})}
if(process.argv.includes('--serve')){previewServer().listen(5175,'127.0.0.1',()=>console.log('本地生产预览：http://127.0.0.1:5175/ 与 /vera-rubin-nvl72/'));}
else{
 const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
 const files=fs.readdirSync(dist,{recursive:true}).filter(f=>fs.statSync(path.join(dist,f)).isFile()),results=[];
 try{
  for(const prefix of ['/','/vera-rubin-nvl72/']){
   for(const file of files){const response=await fetch(origin+prefix+file);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),mime[path.extname(file)]??'application/octet-stream');assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(dist,file)));}
   for(const file of ['assets/missing.js','assets/missing.css','assets/missing.glb','guides/missing.pdf','missing.json']){const response=await fetch(origin+prefix+file);assert.equal(response.status,404);assert.doesNotMatch(response.headers.get('content-type'),/html/)}
   results.push({prefix,files:files.length,missingFiles404:5});
  }
  const html=fs.readFileSync(path.join(dist,'index.html'),'utf8'),guard=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const pathname of ['/vera-rubin-nvl72','/vera-rubin-nvl72/','/','/other-app']){let target=null;vm.runInNewContext(guard,{location:{pathname,search:'?test=1',hash:'#view=tray&tray=18&component=gpu-72',replace:value=>target=value}});assert.equal(target,pathname==='/vera-rubin-nvl72'?'/vera-rubin-nvl72/?test=1#view=tray&tray=18&component=gpu-72':null)}
  for(const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)){assert.ok(match[1].startsWith('./assets/'));}
  for(const file of files.filter(f=>f.endsWith('.js')))assert.doesNotMatch(fs.readFileSync(path.join(dist,file),'utf8'),/qa-reset-context|WEBGL_lose_context扩展|本地验收工具/);
  const version=JSON.parse(fs.readFileSync(path.join(dist,'build-info.json')));assert.match(version.sourceSha256,/^[a-f0-9]{64}$/);
  console.log(JSON.stringify({passed:true,results,canonicalEntry:true,hashPreserved:true,otherAppsUnchanged:true,productionQaExcluded:true,version},null,2));
 }finally{server.close()}
}
