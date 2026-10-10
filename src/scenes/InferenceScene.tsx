import { useMemo } from 'react';
import { Block, Chip, Paths, Annotation, type PathSpec } from './Primitives';
import { useExplorer } from '../stores/useExplorer';
import { pad } from '../utils/format';
import type { Vec3 } from '../models/types';
const gpuPosition=(rank:number):Vec3=>[-4.6+Math.floor(rank/2)*4.6+(rank%2===0?-.85:.85),.42,1.1];
export default function InferenceScene(){
 const {inferenceMode:mode,inferenceStep:step,inferenceRound:round,inferenceToken:token}=useExplorer();
 const paths=useMemo(()=>{
  const p:PathSpec[]=[];
  if(step<2)for(let h=0;h<3;h++)p.push({points:[[-4.6+h*4.6,.4,-1.25],[-4.6+h*4.6,.4,-5.1],[0,.4,-5.1]],type:mode==='realm'?'trust':'management',dashed:true});
  if(step===2)for(let r=1;r<6;r++)p.push({points:[gpuPosition(0),[-5.45,.5,3.2],[gpuPosition(r)[0],.5,3.2],gpuPosition(r)],type:'nvlink'});
  if(step===4||step===5)for(let r=0;r<6;r++){const a=gpuPosition(r),b=gpuPosition((r+1)%6);p.push({points:[a,[a[0],.7,3.5+(r%2)*.25],[b[0],.7,3.5+(r%2)*.25],b],type:'nvlink'})}
  return p;
 },[mode,step,round]);
 return <group>
 {Array.from({length:3},(_,h)=><group key={h}>
  <Block position={[-4.6+h*4.6,-.1,0]} size={[4.05,.18,5.2]} color="#425040"/>
  <Block id={mode==='realm'?'realm':undefined} position={[-4.6+h*4.6,.16,.2]} size={[3.72,.06,4.25]} color={mode==='realm'?'#85669c':'#466583'} opacity={.28}/>
  <Chip id={`cpu-${pad(h)}`} position={[-4.6+h*4.6,.35,-1.25]} size={[1.2,.3,.95]} label={`VERA CPU ${pad(h)}`}/>
  {[0,1].map(j=>{const rank=h*2+j;return <Chip key={rank} id={`gpu-${pad(rank)}`} position={gpuPosition(rank)} size={[1.3,.42,1.4]} label={`RANK ${rank} · GPU ${pad(rank)}`}/>})}
  <Annotation position={[-4.6+h*4.6,.8,-2.8]} title={`OS DOMAIN ${String.fromCharCode(65+h)}`} detail={mode==='realm'?`Realm ${String.fromCharCode(65+h)} · 概念示例`:'独立主机进程域 · 2个示例rank'} color={mode==='realm'?'#d3b1e9':'#9bc1df'}/>
 </group>)}
 <Block position={[0,.0,3.6]} size={[12.8,.32,.72]} color="#a0747c" label="NVLINK 6 SWITCH FABRIC · 逻辑汇聚"/>
 <Block id={step<2?'imex':undefined} position={[0,.16,-5.1]} size={[4.2,.35,.8]} color="#706482" label={mode==='realm'?'证明 / 授权 / NCCL与IMEX控制（概念）':'NCCL初始化 / IMEX映射控制'}/>
 <Paths paths={paths} opacity={.8}/>
 <Annotation position={[0,.3,4.85]} title={step===4?'REDUCE-SCATTER':step===5?'ALLGATHER':step===3||step===6?'LOCAL GPU COMPUTE':'DISTRIBUTED INFERENCE'} detail={[4,5].includes(step)?`教学Ring · 第 ${round+1} / 5 轮 · 非实际物理环`:`第 ${token+1} 个教学token · 6 GPU子集`} color="#e5a8b3"/>
 </group>;
}
