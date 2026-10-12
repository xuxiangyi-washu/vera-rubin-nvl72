import { useMemo } from 'react';
import { Detailed } from '@react-three/drei';
import { catalog, topology, hardwareCounts } from '../data';
import { useExplorer } from '../stores/useExplorer';
import { Block, InstanceBank, Paths, Annotation, type InstanceItem, type PathSpec } from './Primitives';
import type { Vec3 } from '../models/types';

export default function RackScene() {
  const { exploded, selectedId, moduleFilter, lowPower, setView, select, rear, realistic }=useExplorer();
  const offset=(index:number)=>exploded ? (index%2===0 ? 1.35 : .45) : 0;
  const trayEntities=topology.entities.filter(e=>e.type==='compute'||e.type==='switchTray');
  const positions=useMemo(()=>{
    const chips: InstanceItem[]=[],details:InstanceItem[]=[];
    topology.entities.filter(e=>['gpu','cpu','nic','dpu','switch'].includes(e.type)).forEach(e=>{
      if(moduleFilter!=='all'&&moduleFilter!==e.type)return;
      const z=offset(e.trayIndex??e.index??0);
      chips.push({id:e.id,position:[e.position[0],e.position[1],e.position[2]+z],size:e.type==='nic'?[.18,.10,.15]:e.type==='dpu'?[.22,.11,.25]:[.43,.1,.36],color:realistic?(e.type==='nic'?'#343b31':e.type==='switch'?'#b3a78e':'#656e5c'):catalog[e.type].color});
    });
    trayEntities.forEach(e=>{
      for(let i=0;i<12;i++)details.push({position:[-1.26+i*.23,e.position[1]-.015,1.18+offset(e.trayIndex??e.index??0)],size:[.13,.055,.055],color:e.type==='compute'?'#89968b':'#b88b95'});
      for(const x of [-1.5,1.5]) details.push({position:[x,e.position[1],1.2+offset(e.trayIndex??e.index??0)],size:[.06,.12,.12],color:'#a8b2a9'});
    });
    return {chips,details};
  },[exploded,moduleFilter,realistic]);
  const paths:PathSpec[]=useMemo(()=>{
    const list:PathSpec[]=[];
    for(const t of topology.entities.filter(e=>e.type==='compute')){
      const y=t.position[1],z=offset(t.index??0);
      list.push({points:[[1.78,y,-.9],[1.78,y,.6],[1.45,y,.6+z]],type:'cooling'});
      list.push({points:[[-1.75,y,-.95],[-1.75,y,-.5],[-1.45,y,-.5+z]],type:'power'});
      if(selectedId===t.id||exploded)list.push({points:[[0,y,z],[0,y,-1.25],[1.3,.1,-1.25]],type:'nvlink'});
    }
    return list;
  },[selectedId,exploded]);
  const openTray=(id:string,index:number)=>{select(id,index);setView('tray')};
  return <group>
    {/* 机柜外框和前部托盘以参数化几何体表达，单位不对应毫米。 */}
    {[-1.64,1.64].flatMap(x=>[-1.05,1.23].map(z=><Block key={`${x}-${z}`} position={[x,-.02,z]} size={[.15,10.35,.16]} color="#434c46" muted/>))}
    {[-5.15,5.12].map(y=><Block key={y} position={[0,y,.05]} size={[3.43,.2,2.45]} color="#525b52" muted/>)}
    {[4.77,4.49].map(y=><Block key={y} id="management" position={[0,y,.05]} size={[3.06,.22,2.12]} color="#888b79"/>)}
    <Annotation position={[0,5.52,0]} title="VERA RUBIN NVL72" detail="RACK 01 · 参数化结构示意" color="#b6e77d"/>
    {trayEntities.map(t=>{
      const z=offset(t.trayIndex??t.index??0),visible=moduleFilter==='all'||moduleFilter===t.type;
      return <group key={t.id}>
        <Block id={t.id} position={[0,t.position[1]-.055,z]} size={[3.06,.20,2.14]} color={realistic?(t.type==='compute'?'#797e70':'#888573'):(t.type==='compute'?'#596457':'#65535b')} opacity={visible?1:.23}
          onActivate={()=> t.type==='compute' ? openTray(t.id,t.index??0) : setView('fabric')}/>
        <Block position={[0,t.position[1]+.06,-.95+z]} size={[2.86,.11,.12]} color="#3e483b"/>
      </group>;
    })}
    <InstanceBank items={positions.chips}/>
    {!lowPower&&<Detailed distances={[0,24]}><InstanceBank items={positions.details} interactive={false}/><group/></Detailed>}
    {topology.entities.filter(e=>e.type==='power').map(e=><group key={e.id}><Block id={e.id} position={e.position} size={[3.06,.42,2.1]} color="#454d49"/>
      {Array.from({length:6},(_,i)=><Block key={i} position={[-1.24+i*.50,e.position[1],1.09]} size={[.43,.30,.07]} color="#96998c"/>)}
    </group>)}
    {topology.entities.filter(e=>e.type==='cartridge').map(e=><Block key={e.id} id={e.id} position={e.position} size={[.58,8.7,.28]} color="#6e453a" opacity={rear?1:.6}/>)}
    <Block id="busbar" position={[-1.84,-.1,-.95]} size={[.12,9.8,.2]} color="#b3955b"/>
    <Block id="cooling" position={[1.84,-.1,-.9]} size={[.11,9.8,.15]} color="#438e92"/>
    <Block id="cooling" position={[2.04,-.1,-.9]} size={[.1,9.8,.15]} color="#2c697a"/>
    <Paths paths={paths} opacity={.38}/>
    <Annotation position={[-4.0,2.05,.9]} title={`${hardwareCounts.rack.compute} × Compute Tray`} detail={`上10 / 下8 · ${hardwareCounts.tray.gpu} GPU + ${hardwareCounts.tray.cpu} CPU 每托盘`} color="#b5da94"/>
    <Annotation position={[4.0,-.62,.8]} title={`${hardwareCounts.rack.switchTray} × Switch Tray`} detail={`${hardwareCounts.rack.switch} × NVLink 6 ASIC`} color="#e4a0ac"/>
    {rear&&<Annotation position={[0,2,-1.6]} title="4 × Cable Cartridge" detail="约 5,000 条铜缆 · 汇聚示意" color="#efa88a"/>}
  </group>;
}
