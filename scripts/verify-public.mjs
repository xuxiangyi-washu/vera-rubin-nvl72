import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
// 只读取已发布的静态文件，验证与本地生产构建逐字节一致。
const target=process.argv[3]??'cloudflare';
const sites={cloudflare:'https://vera-rubin-nvl72.xuxiangyi666.workers.dev',cloudbase:'https://aurora-d4g5u80cq1b5f11de-1464571490.tcloudbaseapp.com/vera-rubin-nvl72'};
if(!sites[target])throw new Error('未知托管目标');
const url=sites[target];
const files=fs.readdirSync('dist',{recursive:true}).filter(file=>fs.statSync(path.join('dist',file)).isFile());
const digest=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const local=files.map(file=>{const data=fs.readFileSync(path.join('dist',file));return {path:file,bytes:data.length,gzipBytes:zlib.gzipSync(data).length,sha256:digest(data)}});
fs.writeFileSync('research/build-manifest.json',JSON.stringify({builtAt:new Date().toISOString(),files:local},null,2)+'\n');
const results=await Promise.allSettled(local.map(async item=>{
 const resource=item.path==='index.html'?'/':'/'+item.path;
 const response=await fetch(url+resource,{signal:AbortSignal.timeout(45000),headers:{'Cache-Control':'no-cache'}});
 const data=Buffer.from(await response.arrayBuffer());
 const sha256=digest(data),mime=response.headers.get('content-type')??'';
 const expected=item.path.endsWith('.pdf')?'application/pdf':item.path.endsWith('.js')?'javascript':item.path.endsWith('.css')?'text/css':item.path.endsWith('.json')?'application/json':item.path.endsWith('.html')?'text/html':null;
 return {path:resource,status:response.status,type:mime,bytes:data.length,sha256,matchesLocal:sha256===item.sha256,validType:expected?mime.includes(expected):true};
}));
const report={url,version:process.argv[2]??null,checkedAt:new Date().toISOString(),results:results.map((r,i)=>r.status==='fulfilled'?r.value:{path:local[i].path,error:String(r.reason)})};
fs.writeFileSync(`research/${target}-deployment.json`,JSON.stringify(report,null,2)+'\n');
const failures=report.results.filter(r=>r.status!==200||!r.matchesLocal||!r.validType);
console.log(JSON.stringify({url,version:report.version,checkedFiles:files.length,failures,pdf:report.results.find(r=>r.path.endsWith('.pdf'))},null,2));
if(failures.length)process.exitCode=1;
