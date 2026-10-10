export interface RingPacket { source:number; target:number; chunk:number; value:number }
export interface RingSnapshot { phase:string; round:number; buffers:number[][]; packets:RingPacket[] }
export function createRingAllReduce(inputs:number[][]):RingSnapshot[];
export const teachingInputs:number[][];
