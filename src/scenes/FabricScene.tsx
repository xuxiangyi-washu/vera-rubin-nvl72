import { useMemo } from 'react';
import { useExplorer } from '../stores/useExplorer';
import { Block, InstanceBank, Paths, Annotation, type PathSpec } from './Primitives';
import { pad } from '../utils/format';
import type { Vec3 } from '../models/types';
import SwitchTrayScene from './SwitchTrayScene';

const gpuPosition=(i:number):Vec3=>[(i<36?-6.25:3.35)+(i%4)*.82,.24,-3.3+(Math.floor(i/4)%9)*.82];
const switchPosition=(i:number):Vec3=>[-1.2+(i%4)*.8,.28,-3.3+Math.floor(i/4)*.82];
export default function FabricScene(){
 const {sourceGpu:gi,targetGpu:target,fabricTray,fabricAsic,allPaths,moduleFilter,fabricMode,fabricStage,fabricOperation,realistic}=useExplorer();
 const si=fabricTray*4+fabricAsic;
 const {background,focused}=useMemo(()=>{
  const background:PathSpec[]=[],focused:PathSpec[]=[];const start=gpuPosition(gi),end=gpuPosition(target),sw=switchPosition(si);
  if(allPaths){for(let i=0;i<72;i++){const p=gpuPosition(i);background.push({points:[p,[i<36?-2.45:2.45,.08,p[2]],[i<36?-2.45:2.45,.08,0]],type:'nvlink'})}for(let i=0;i<36;i++){const p=switchPosition(i);background.push({points:[[-2.45,.08,0],[-2.45,.08,p[2]],p,[2.45,.08,p[2]],[2.45,.08,0]],type:'nvlink',dashed:true})}}
  const route:Vec3[]=[start,[gi<36?-2.45:2.45,.55,start[2]],sw,[target<36?-2.45:2.45,.55,end[2]],end];
  background.push({points:route,type:'nvlink'});
  if(fabricStage>0)focused.push({points:route.slice(0,fabricStage+1),type:'nvlink'});
  if(fabricOperation==='allreduce'&&fabricStage>=2)for(let i=0;i<4;i++){const p=gpuPosition(Math.floor(gi/4)*4+i);focused.push({points:[p,[p[0]<0?-2.45:2.45,.7,p[2]],sw],type:'nvlink'})}
  if(fabricOperation==='moe'&&fabricStage>=3)for(let i=1;i<4;i++){const p=gpuPosition((target+i*4)%72);focused.push({points:[sw,[p[0]<0?-2.45:2.45,.7,p[2]],p],type:'nvlink'})}
  return {background,focused};
 },[gi,target,si,allPaths,fabricStage,fabricOperation]);
 if(fabricMode==='switchTray')return <SwitchTrayScene/>;
 return <group>
  {Array.from({length:18},(_,i)=><Block key={i} id={`tray-${pad(i)}`} position={[i<9?-5.02:4.58,.015,-3.3+(i%9)*.82]} size={[3.62,.17,.71]} color={realistic?'#65705d':'#263b2d'}/>)}
  {(moduleFilter==='all'||moduleFilter==='gpu')&&<InstanceBank items={Array.from({length:72},(_,i)=>({id:`gpu-${pad(i)}`,position:gpuPosition(i),size:[.59,.27,.51],color:i===gi?'#d1ff8a':i===target?'#e8bd76':realistic?'#667557':'#799451'}))}/>}
  {Array.from({length:9},(_,i)=><group key={i}><Block id={`switch-tray-${pad(i)}`} position={[0,.0,-3.3+i*.82]} size={[3.35,.19,.70]} color={i===fabricTray?'#b99280':'#72695f'}/><Block position={[0,.11,-3.3+i*.82-.29]} size={[3.1,.08,.06]} color="#9d998e"/></group>)}
  {(moduleFilter==='all'||moduleFilter==='switch')&&<InstanceBank items={Array.from({length:36},(_,i)=>({id:`switch-${pad(i)}`,position:switchPosition(i),size:[.53,.26,.46],color:i===si?'#f5b4bc':realistic?'#967761':'#df8c9d'}))}/>}
  <Paths paths={background} opacity={.16}/><Paths paths={focused} opacity={.9}/>
  <Annotation position={[-5.0,.1,4.55]} title="9 COMPUTE TRAYS · GPU 01—36" detail="每托盘 4 GPU · 按逻辑拓扑平铺" color="#b5e278"/>
  <Annotation position={[4.65,.1,4.55]} title="9 COMPUTE TRAYS · GPU 37—72" detail="空间布局用于解释，非机柜纵向排布" color="#b5e278"/>
  <Annotation position={[0,.2,-4.15]} title="9 SWITCH TRAYS / 36 ASICs" detail="通过后部 spine 连接 · 端口映射待核实" color="#e4a1b2"/>
  <Annotation position={[0,.2,4.65]} title={`GPU ${pad(gi)} → SW ${pad(si)} → GPU ${pad(target)}`} detail={fabricOperation==='allreduce'?'SHARP 归约教学路径':'选定交换路径示意'} color="#ffb4c0"/>
 </group>;
}
