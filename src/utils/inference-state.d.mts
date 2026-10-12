import type {RingSnapshot} from './ring.mjs';
export interface InferenceCursor{inferenceStep:number;inferenceRound:number;inferenceToken:number}
export const ringSnapshots:RingSnapshot[];
export const inferenceTimeline:InferenceCursor[];
export function cursorIndex(state:InferenceCursor):number;
export function moveInference(state:InferenceCursor,delta:number):InferenceCursor & {inferencePlaying?:boolean};
export function inferenceSnapshot(state:InferenceCursor):RingSnapshot;
export function createPlaybackClock(tick:()=>void,scheduler?:{set:(fn:()=>void,ms:number)=>unknown;clear:(id:unknown)=>void}):{sync:(active:boolean,delay:number)=>void;stop:()=>void};
