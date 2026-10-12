import {hardwareCounts} from '../data';
import { useMemo } from 'react';
import { useExplorer } from '../stores/useExplorer';
import { Block, Chip, Paths, Annotation, InstanceBank, type PathSpec } from './Primitives';
import { pad } from '../utils/format';
import { TrayHardwareDetails } from './HardwareDetails';
import type { Vec3 } from '../models/types';

export default function TrayScene() {
  const {trayIndex:t,exploded,moduleFilter,realistic}=useExplorer();
  const lift=exploded?.9:0;
  const cpu=(s:number):Vec3=>[s===0?-2.15:2.15,.3+lift,-.6];
  const gpu=(g:number):Vec3=>[[-2.9,-1.35,1.35,2.9][g],.33+lift,-2.05];
  const nic=(n:number):Vec3=>[[-3.48,-2.64,-1.80,-.96,.96,1.80,2.64,3.48][n],.24,2.7];
  const dpu:Vec3=[0,.3+lift,2.25];
  const paths=useMemo(()=>{
    const p:PathSpec[]=[];
    for(let g=0;g<hardwareCounts.tray.gpu;g++){
      p.push({points:[cpu(Math.floor(g/2)),gpu(g)],type:'c2c'});
      p.push({points:[gpu(g),[gpu(g)[0],.4+lift,-2.65],[0,.4,-3.4]],type:'nvlink'});
    }
    for(let n=0;n<hardwareCounts.tray.nic;n++){
      p.push({points:[dpu,[-3.8+(n*.07),.75,-1.4],[-3.8+(n*.07),.65,2.4],nic(n)],type:'astra',dashed:true});
      p.push({points:[cpu(Math.floor(n/4)),[nic(n)[0],.26,1.95],nic(n)],type:'pcie',dashed:true});
      p.push({points:[nic(n),[nic(n)[0],.24,3.7]],type:'scaleout'});
    }
    p.push({points:[[4.1,-.08,-2.7],[4.1,.45,0],[-4.1,.45,0],[-4.1,-.08,-2.7]],type:'cooling'});
    p.push({points:[[-3.75,.2,-2.6],[-3.75,.2,-1.3],[-2.15,.24,-.6]],type:'power'});
    p.push({points:[dpu,[0,.3,-3.4]],type:'storage'});
    p.push({points:[[-3.5,.2,-1.6],[-3.1,.2,-2.3],dpu],type:'management',dashed:true});
    return p;
  },[t,exploded]);
  const visible=(type:string)=>moduleFilter==='all'||moduleFilter===type;
  return <group scale={realistic?[.78,1,1.35]:[1,1,1]}>
    <Block id={`tray-${pad(t)}`} position={[0,-.2,0]} size={[8.65,.3,6.25]} color={realistic?'#666d63':'#536352'}/>
    <Block position={[0,-.025,0]} size={[8.3,.08,5.9]} color={realistic?'#172b20':'#183b2e'}/>
    {[-4.34,4.34].map(x=><Block key={x} position={[x,.04,0]} size={[.1,.45,6.4]} color="#929b8e"/>)}
    <Block position={[0,.05,3.11]} size={[8.7,.48,.12]} color={realistic?'#a19e83':'#59675b'}/>
    {[0,1].map(s=><group key={s}>
      <Block id={`superchip-${pad(t*2+s)}`} position={[s===0?-2.16:2.16,.055,-1.45]} size={[3.47,.08,3.10]} color="#365741"/>
      {visible('cpu')&&<Chip id={`cpu-${pad(t*2+s)}`} position={cpu(s)} size={[1.05,.25,1.12]} label={`VERA ${pad(t*2+s)}`}/>}
    </group>)}
    {visible('gpu')&&[0,1,2,3].map(g=><group key={g}><Chip id={`gpu-${pad(t*4+g)}`} position={gpu(g)} size={[1.1,.3,1.05]} label={`RUBIN ${pad(t*4+g)}`}/>
      <InstanceBank interactive={false} items={[-.64,.64].flatMap(x=>[-.42,-.14,.14,.42].map(z=>({position:[gpu(g)[0]+x,.29+lift,-2.05+z] as Vec3,size:[.16,.13,.23] as Vec3,color:'#485149'})))}/>
    </group>)}
    {visible('nic')&&Array.from({length:hardwareCounts.tray.nic},(_,n)=><Chip key={n} id={`cx9-${pad(t*8+n,3)}`} position={nic(n)} size={[.58,.18,.58]} label={`CX9逻辑端点 ${pad(t*8+n,3)}`}/>)}
    {visible('dpu')&&<Chip id={`dpu-${pad(t)}`} position={dpu} size={[.95,.25,1.04]} label={`BLUEFIELD-4 · ${pad(t)}`}/>}
    <Block id={`bmc-${pad(t)}`} position={[-3.5,.18,-1.6]} size={[.45,.17,.6]} color="#869399" label="BMC"/>
    <Block id={`hmc-${pad(t)}`} position={[-3.1,.18,-2.3]} size={[.38,.17,.4]} color="#869399" label="HMC"/>
    <Block id="spine" position={[0,.03,-3.25]} size={[5.7,.3,.32]} color="#8d5559" label="REAR · NVLINK SPINE"/>
    {realistic&&<TrayHardwareDetails lift={lift}/>}
    <Paths paths={paths}/>
    <Annotation position={[-2.3,.12,-3.8]} title="SUPERCHIP 01" detail="1 CPU + 2 GPU · C2C 聚合 1.8 TB/s" color="#83c5be"/>
    <Annotation position={[2.3,.12,-3.8]} title="SUPERCHIP 02" detail="1 CPU + 2 GPU · C2C 聚合 1.8 TB/s" color="#83c5be"/>
  </group>;
}
