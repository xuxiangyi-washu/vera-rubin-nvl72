// 通用AES-GCM教学实现；参数和报文不代表NVLink 6硬件协议。
export async function createDemoKey() {
  return crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function encryptDemoPacket(key,sequence) {
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const aad=new TextEncoder().encode(`teaching-domain=demo;session=1;sequence=${sequence}`);
  const plaintext='教学GPU激活分块：[1,2,3,4]';
  const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},key,new TextEncoder().encode(plaintext));
  return {sequence,iv,aad,ciphertext,plaintext};
}
export async function receiveDemoPacket(key,packet,seen,{mutation='none',replayGuard=true}={}) {
  const ciphertext=new Uint8Array(packet.ciphertext.slice(0));
  const aad=new Uint8Array(packet.aad);
  if(mutation==='ciphertext')ciphertext[0]^=1;
  if(mutation==='aad')aad[0]^=1;
  let decrypted;
  try{decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:packet.iv,additionalData:aad,tagLength:128},key,ciphertext)}
  catch{return {kind:'authentication-failed',plaintext:''};}
  const replayed=seen.has(packet.sequence);
  if(replayGuard&&replayed)return {kind:'replay-rejected',plaintext:''};
  seen.add(packet.sequence);
  return {kind:replayed?'replay-accepted':'accepted',plaintext:new TextDecoder().decode(decrypted)};
}
