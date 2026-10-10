import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoKey, encryptDemoPacket, receiveDemoPacket } from '../src/utils/aead-demo.mjs';

test('教学AES-GCM正常验签解密，且密钥不可导出',async()=>{
 const key=await createDemoKey(),packet=await encryptDemoPacket(key,1);
 assert.equal(key.extractable,false);
 const result=await receiveDemoPacket(key,packet,new Set());assert.equal(result.kind,'accepted');assert.equal(result.plaintext,packet.plaintext);
});
test('篡改密文或AAD不会释放教学明文',async()=>{
 const key=await createDemoKey(),packet=await encryptDemoPacket(key,2);
 for(const mutation of ['ciphertext','aad']){const r=await receiveDemoPacket(key,packet,new Set(),{mutation});assert.equal(r.kind,'authentication-failed');assert.equal(r.plaintext,'')}
});
test('重放检测是独立状态校验，合法认证标签本身不会拒绝重复包',async()=>{
 const key=await createDemoKey(),packet=await encryptDemoPacket(key,3),seen=new Set();
 await receiveDemoPacket(key,packet,seen);
 assert.equal((await receiveDemoPacket(key,packet,seen)).kind,'replay-rejected');
 assert.equal((await receiveDemoPacket(key,packet,seen,{replayGuard:false})).kind,'replay-accepted');
});
