import { useMemo } from 'react';
import { Block, InstanceBank, Paths, Annotation, type PathSpec } from './Primitives';
import { useExplorer } from '../stores/useExplorer';
import { pad } from '../utils/format';
import type { Vec3 } from '../models/types';

export default function NetworkScene(){
  const { network,trayIndex:t }=useExplorer();
  const paths=useMemo(()=>{
    const p:PathSpec[]=[];
    for(const x of [-4.6,0,4.6]){
      p.push({points:[[x,.7,3.4],[x,3.5,3.4],[x,4.5,-.7],[0,4.5,-.7]],type:'scaleout'});
      p.push({points:[[x,-1,3.4],[x,-2.8,3.5],[6.6,-2.8,4.0],[6.6,-1.7,4.0]],type:'storage'});
      p.push({points:[[x,-1.7,3.4],[x,-3.05,3.9],[-6.6,-3.05,4.0],[-6.6,-1.7,4.0]],type:'management',dashed:true});
    }
    for(let n=0;n<8;n++)p.push({points:[[0,-1,3.2],[-1.25+n*.36,.7,3.25]],type:'astra',dashed:true});
    return p;
  },[]);
  return <group>
    {[-4.6,0,4.6].map((x,i)=><group key={i} position={[x,0,2]}>
      <Block id={i===1?'rack-01':undefined} position={[0,0,0]} size={[3.05,5.2,2.35]} color="#29362d"/>
      <InstanceBank interactive={i===1} items={Array.from({length:18},(_,j)=>({id:i===1?`tray-${pad(j)}`:undefined,position:[0,-2.25+j*.25,1.21] as Vec3,size:[2.77,.17,.14] as Vec3,color:j===t?'#a8d56b':'#737e6f'}))}/>
      <Annotation position={[0,3.05,0]} title={i===1?'NVL72 · RACK 01':`PEER RACK ${i===0?'A':'B'}`} detail={i===1?'当前机架':'外部对端 · 示意'} color="#c4dca6"/>
    </group>)}
    <Block id="external" position={[0,4.5,-.7]} size={[6.2,.65,1.15]} color="#446581" label={network==='ethernet'?'SPECTRUM-X · SPECTRUM-6':'QUANTUM-X800 · INFINIBAND'}/>
    <InstanceBank interactive={false} items={Array.from({length:16},(_,i)=>({position:[-2.65+i*.35,4.55,-.05],size:[.22,.25,.10],color:'#8bbded'}))}/>
    <Block id="storage" position={[6.6,-1.7,4.0]} size={[2.6,1.5,1.3]} color="#39786d" label="STORAGE / SERVICES"/>
    <Block id="management" position={[-6.6,-1.7,4.0]} size={[2.6,.7,1.3]} color="#727c81" label="OOB MANAGEMENT"/>
    {Array.from({length:8},(_,n)=><Block key={n} id={`cx9-${pad(t*8+n,3)}`} position={[-1.25+n*.36,.7,3.25]} size={[.27,.24,.15]} color="#64a9f0"/>)}
    <Block id={`dpu-${pad(t)}`} position={[0,-1,3.3]} size={[.85,.42,.15]} color="#a7d66e" label={`DPU ${pad(t)} · ASTRA`}/>
    <Paths paths={paths}/>
    <Annotation position={[0,5.4,-1.6]} title={network==='ethernet'?'Ethernet / RoCE':'InfiniBand / RDMA'} detail="蓝色计算数据面 · 绿色基础设施控制" color="#8dbff7"/>
  </group>;
}
