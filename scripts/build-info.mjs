import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
// 只记录版本指纹，不记录环境变量、工作目录或凭据。
export function createBuildInfo(){
 const hash=crypto.createHash('sha256');
 for(const folder of ['src','data','public','scripts'])for(const file of fs.readdirSync(folder,{recursive:true}).sort()){const p=path.join(folder,file);if(fs.statSync(p).isFile()){hash.update(p);hash.update(fs.readFileSync(p))}}
 for(const file of ['package.json','package-lock.json','vite.config.ts','index.html','wrangler.jsonc']){hash.update(file);hash.update(fs.readFileSync(file))}
 let commit='unknown',dirty=true;
 try{commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();dirty=Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim())}catch{}
 return {schemaVersion:1,commit,dirty,sourceSha256:hash.digest('hex'),builtAt:new Date().toISOString(),nodeVersion:process.version,base:'./'};
}
