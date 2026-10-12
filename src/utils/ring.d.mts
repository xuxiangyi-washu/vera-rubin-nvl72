export interface RingPacket {source:number;target:number;chunk:number;value:number;contributors:number[]}
export interface RingSnapshot {phase:string;round:number;buffers:number[][];contributors:number[][][];packets:RingPacket[];ownersByChunk:number[]}
export function createRingAllReduce(inputs:number[][]):RingSnapshot[];
export function reduceScatterByOutputRank(snapshots:RingSnapshot[]):number[];
export const teachingInputs:number[][];
