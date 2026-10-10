export interface DemoPacket { sequence:number; iv:Uint8Array; aad:Uint8Array; ciphertext:ArrayBuffer; plaintext:string }
export interface DemoResult { kind:'authentication-failed'|'replay-rejected'|'replay-accepted'|'accepted'; plaintext:string }
export function createDemoKey():Promise<CryptoKey>;
export function encryptDemoPacket(key:CryptoKey,sequence:number):Promise<DemoPacket>;
export function receiveDemoPacket(key:CryptoKey,packet:DemoPacket,seen:Set<number>,options?:{mutation?:'none'|'ciphertext'|'aad';replayGuard?:boolean}):Promise<DemoResult>;
