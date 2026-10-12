import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRingAllReduce,reduceScatterByOutputRank,teachingInputs} from '../src/utils/ring.mjs';
import {moveInference,inferenceTimeline,inferenceSnapshot,createPlaybackClock} from '../src/utils/inference-state.mjs';
import {rendererTransition,initialRendererState} from '../src/utils/renderer-state.mjs';
import {parseExploration,serializeExploration} from '../src/utils/exploration-url.mjs';
import {filterSources,sourceLabel} from '../src/utils/evidence.mjs';
import {payloadLinks,isPayloadPath,matchesFlow} from '../src/utils/link-semantics.mjs';
const json=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const topology=json('data/nvl72-topology.json'),sources=json('src/data/sources.json');
test('独立100r+k数据遵循规范Reduce-Scatter输出和AllGather结果',()=>{
 const input=Array.from({length:6},(_,r)=>Array.from({length:6},(_,k)=>100*r+k));
 const snapshots=createRingAllReduce(input),expected=[1500,1506,1512,1518,1524,1530];
 assert.deepEqual(reduceScatterByOutputRank(snapshots),expected);
 assert.ok(snapshots.at(-1).buffers.every(row=>JSON.stringify(row)===JSON.stringify(expected)));
});
test('每轮每分块值恰好等于累计来源之和，无重复来源或提前完成',()=>{
 for(const input of [teachingInputs,Array.from({length:6},(_,r)=>Array.from({length:6},(_,k)=>100*r+k))])for(const snapshot of createRingAllReduce(input)){
  for(let r=0;r<6;r++)for(let k=0;k<6;k++){
   const provenance=snapshot.contributors[r][k];assert.equal(new Set(provenance).size,provenance.length);
   assert.equal(snapshot.buffers[r][k],provenance.reduce((sum,source)=>sum+input[source][k],0));
   if(snapshot.phase==='reduce-scatter')assert.ok(provenance.length<=snapshot.round+1);
  }
 }
});
test('NCCL前后定位可重现同一快照，OS和Realm分组不改变数学状态',()=>{
 for(let i=1;i<inferenceTimeline.length-1;i++){
  const state=inferenceTimeline[i];assert.deepEqual(moveInference(moveInference(state,1),-1),state);
  assert.deepEqual(inferenceSnapshot({...state,inferenceMode:'os'}),inferenceSnapshot({...state,inferenceMode:'realm'}));
 }
 let state={...inferenceTimeline[0]};for(let i=0;i<300;i++)state={...state,...moveInference(state,1)};
 assert.equal(state.inferenceStep,8);assert.equal(state.inferencePlaying,false);
});
test('播放时钟重复启动仍只有一个任务，暂停/隐藏/卸载后旧回调无效',()=>{
 let id=0,count=0;const pending=new Map();const scheduler={set:fn=>{pending.set(++id,fn);return id},clear:id=>pending.delete(id)};
 const clock=createPlaybackClock(()=>count++,scheduler);
 clock.sync(true,100);const old=pending.values().next().value;clock.sync(true,50);assert.equal(pending.size,1);old();assert.equal(count,0);
 const [key,fn]=pending.entries().next().value;pending.delete(key);fn();assert.equal(count,1);assert.equal(pending.size,1);
 clock.sync(false,50);assert.equal(pending.size,0);fn();assert.equal(count,1);clock.stop();assert.equal(pending.size,0);
});
test('渲染初始化失败与上下文丢失均能进入二维，再试只有一个新代次',()=>{
 let s=rendererTransition(initialRendererState,{type:'failed',generation:0});assert.equal(s.status,'failed');
 s=rendererTransition(s,{type:'retry'});assert.equal(s.generation,1);assert.equal(rendererTransition(s,{type:'retry'}).generation,1);
 assert.equal(rendererTransition(s,{type:'ready',generation:0}).status,'loading');
 s=rendererTransition(s,{type:'ready',generation:1});assert.equal(s.status,'ready');s=rendererTransition(s,{type:'lost',generation:1});assert.equal(s.status,'lost');
 s=rendererTransition(s,{type:'2d'});assert.equal(rendererTransition(s,{type:'ready',generation:1}).status,'2d');
});
test('深链接恢复GPU72、托盘18与NCCL离散状态，默认不播放',()=>{
 const s=parseExploration('#view=inference&tray=1&component=gpu-72&topic=sentry&phase=6&round=5&token=2&mode=os',topology.entities);
 assert.equal(s.trayIndex,17);assert.equal(s.selectedId,'gpu-72');assert.equal(s.inferenceRound,4);assert.equal(s.inferenceStep,5);assert.equal(s.inferencePlaying,false);assert.equal(s.animated,false);
 const next=parseExploration(serializeExploration(s),topology.entities);assert.deepEqual(next,s);
});
test('无效深链接安全回退且不把注入内容作为实体或专题',()=>{
 const s=parseExploration('#view=bad&component=<script>&tray=99&phase=NaN&topic=constructor&round=-3',topology.entities);
 assert.equal(s.view,'rack');assert.equal(s.trayIndex,0);assert.equal(s.selectedId,'rack-01');assert.equal(s.securityGuide,null);assert.equal(s.inferenceRound,0);
});
test('VIS01按第三方视觉参考分类；本地材料明确不可公开核对',()=>{
 const vis=sources.find(x=>x.id==='VIS01');assert.equal(vis.kind,'third-party');assert.equal(vis.purpose,'visual');assert.doesNotMatch(sourceLabel(vis),/官方/);
 assert.ok(filterSources(sources,'storagereview','visual').some(x=>x.id==='VIS01'));
 for(const id of ['HW90','HW91','SEC19','USER']){const s=sources.find(x=>x.id===id);assert.equal(s.access,'unpublished');assert.match(s.scopeNote,/未提供公开链接/);assert.ok(!s.url)}
 assert.equal(filterSources(sources,'__no_matching_source__').length,0);
});
test('CX9卡、软件接口和逻辑端点独立计数，每个逐值记录有来源和范围',()=>{
 const c=json('src/data/catalog.json');assert.equal(topology.entities.filter(e=>e.type==='nic').length,144);
 for(const label of ['CX9 I/O 卡','CX9 软件接口','CX9 逻辑端点']){const fact=c.compute.specs.find(f=>f.label===label);assert.ok(fact.observations[0].countObject);assert.ok(fact.observations[0].platform)}
 assert.equal(c.compute.specs.find(f=>f.label==='CX9 I/O 卡').observations[0].value,'2');
 for(const model of Object.values(c))for(const fact of model.specs)for(const o of fact.observations??[]){assert.ok(sources.some(s=>s.id===o.source));for(const key of ['scope','direction','platform','date','version'])assert.ok(o[key])}
});
test('Astra与管理关系不能进入载荷寻路或粒子列表',()=>{
 const links=payloadLinks(topology.links);assert.ok(links.length>0);assert.ok(links.every(l=>!['astra','management','trust'].includes(l.type)));
 assert.equal(isPayloadPath({type:'astra'}),false);assert.equal(isPayloadPath({type:'pcie',flow:'control'}),false);assert.equal(isPayloadPath({type:'nvlink'}),true);assert.equal(matchesFlow({type:'pcie',flow:'control'},'compute'),false);assert.equal(matchesFlow({type:'astra'},'control'),true);
});
