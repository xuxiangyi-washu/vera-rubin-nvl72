import test from 'node:test';
import assert from 'node:assert/strict';
import { createRingAllReduce, teachingInputs } from '../src/utils/ring.mjs';

test('环形Reduce-Scatter与AllGather得到每个rank相同的正确求和结果',()=>{
 for(const count of [2,3,6]){
  const input=Array.from({length:count},(_,rank)=>Array.from({length:count},(_,chunk)=>(rank-2)*(chunk+1)));
  const expected=input[0].map((_,chunk)=>input.reduce((sum,row)=>sum+row[chunk],0));
  const snapshots=createRingAllReduce(input);
  assert.equal(snapshots.length,1+2*(count-1));
  for(const row of snapshots.at(-1).buffers)assert.deepEqual(row,expected);
  const scattered=snapshots[count-1];
  for(let rank=0;rank<count;rank++)assert.equal(scattered.buffers[rank][(rank+1)%count],expected[(rank+1)%count]);
 }
});
test('示例数据不被动画修改，每轮仅向相邻逻辑rank发送一个分块',()=>{
 const original=JSON.stringify(teachingInputs),snapshots=createRingAllReduce(teachingInputs);
 assert.equal(JSON.stringify(teachingInputs),original);
 for(const snapshot of snapshots.slice(1)){
  assert.equal(snapshot.packets.length,6);
  for(const packet of snapshot.packets)assert.equal(packet.target,(packet.source+1)%6);
 }
 assert.deepEqual(snapshots.at(-1).buffers[0],[21,42,63,84,105,126]);
});
test('拒绝不匹配的示例rank/分块数与非法值',()=>{
 assert.throws(()=>createRingAllReduce([[1],[2]]));
 assert.throws(()=>createRingAllReduce([[1,NaN],[2,3]]));
});
