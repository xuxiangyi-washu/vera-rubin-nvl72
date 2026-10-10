import { Block, Chip, InstanceBank, Paths, Annotation, type PathSpec } from './Primitives';
import { useExplorer } from '../stores/useExplorer';
import { pad } from '../utils/format';
import type { Vec3 } from '../models/types';

export default function SwitchTrayScene(){
 const {fabricTray:t,fabricAsic:c,realistic}=useExplorer();
 const positions:Vec3[]=[[-1.35,.32,-2.3],[.55,.32,-1.9],[-.55,.32,-.8],[1.35,.32,-.35]];
 const paths:PathSpec[]=positions.map(p=>({points:[[p[0],.35,-4.3],[p[0],.45,-3.15],p,[p[0]+.3,.5,p[2]+.35],[2.7,.45,2.1]],type:'nvlink'}));
 return <group><Block id={`switch-tray-${pad(t)}`} position={[0,-.22,0]} size={[6.4,.28,9.15]} color="#7c8076"/><Block position={[0,-.035,-1.15]} size={[6.05,.08,6.6]} color="#253229"/>
 {[-3.15,3.15].map(x=><Block key={x} position={[x,.1,0]} size={[.12,.52,9.3]} color="#a5aa9f"/>)}
 <Block position={[0,.08,4.55]} size={[6.4,.44,.12]} color="#b1aa89"/>
 <Block position={[0,.1,1.55]} size={[5.95,.22,2.8]} color="#777f73"/>
 {positions.map((p,i)=><group key={i}><Chip id={`switch-${pad(t*4+i)}`} position={p} size={[1.02,.34,1.05]} label={`NVLINK 6 · SW ${pad(t*4+i)}`}/>{realistic&&<Block position={[p[0],.52,p[2]]} size={[.84,.035,.87]} color={i===c?'#dbad76':'#a98268'}/>}</group>)}
 <InstanceBank interactive={false} items={Array.from({length:12},(_,i)=>({position:[-2.7+i*.49,.24,-4.34] as Vec3,size:[.31,.36,.2] as Vec3,color:'#8b947d'}))}/>
 <InstanceBank interactive={false} items={Array.from({length:4},(_,i)=>({position:[-2.65+i*.42,.1,4.63] as Vec3,size:[.24,.19,.055] as Vec3,color:'#111b14'}))}/>
 <Block id="management" position={[-1.9,.27,2.6]} size={[1.5,.3,1.35]} color="#464f42" label="SYSTEM MANAGEMENT"/>
 <Paths paths={paths} opacity={.55}/><Paths paths={[{points:[[-2.8,.4,-4.2],[-2.8,.5,-2.7],[2.7,.5,-2.7],[2.7,.5,.5],[-2.8,.5,.5],[-2.8,.4,3.1]],type:'cooling'}]} opacity={.75}/>
 <Annotation position={[0,.5,-5]} title={`NVLINK SWITCH TRAY ${pad(t)}`} detail="4 ASIC · 每 ASIC 72 个 NVLink 6 端口；线束为汇聚示意" color="#e5adad"/>
 <Annotation position={[0,.3,5.3]} title="金属托盘 / 冷板 / 管路" detail="外观参考 NVIDIA 官方图 · 非机械 CAD" color="#bccca8"/>
 </group>;
}
