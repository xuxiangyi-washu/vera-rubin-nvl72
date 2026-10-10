import { Block, Paths, Annotation, type PathSpec } from './Primitives';
import { useExplorer } from '../stores/useExplorer';

export default function SecurityScene(){
 const trust=useExplorer(s=>s.view==='trust'),update=useExplorer(s=>s.update);
 const paths:PathSpec[]=trust?[
  {points:[[-5,0,0],[-2.4,0,0]],type:'trust'},
  {points:[[-2.4,0,0],[.2,0,-2.6]],type:'trust'},
  {points:[[-2.4,0,0],[.2,0,0]],type:'trust'},
  {points:[[-2.4,0,0],[.2,0,2.6]],type:'trust'},
  {points:[[.2,0,-2.6],[3.5,0,-1.3]],type:'trust'},
  {points:[[.2,0,0],[3.5,0,-1.3]],type:'trust'},
  {points:[[.2,0,2.6],[3.5,0,2.6]],type:'astra',dashed:true},
 ]:[
  {points:[[-3,.2,-1.8],[-3,.2,1]],type:'c2c'},
  {points:[[-3,.2,1],[0,.2,1],[3,.2,1]],type:'nvlink'},
  {points:[[-3,.2,-1.8],[0,.2,-1.8],[3,.2,-1.8]],type:'pcie'},
  {points:[[4.8,.2,-3.3],[3,.2,-1.8]],type:'astra',dashed:true},
  {points:[[4.8,.2,-3.3],[4.8,.2,-.7]],type:'astra',dashed:true},
 ];
 if(trust)return <group>
  <Block id="root" position={[-5,0,0]} size={[1.7,.55,1.4]} color="#75648e" label="01 · 硬件根信任"/>
  <Block id="firmware" position={[-2.4,0,0]} size={[1.7,.55,1.4]} color="#8e77a8" label="02 · 固件 / 设备测量"/>
  <Block onActivate={()=>update({securityGuide:'confidential'})} id="realm" position={[.2,0,-2.6]} size={[2.1,.55,1.4]} color="#a393ca" label="CPU / GUEST 证明"/>
  <Block id="io" position={[.2,0,0]} size={[2.1,.55,1.4]} color="#a393ca" label="SPDM · TDISP · IDE"/>
  <Block onActivate={()=>update({securityGuide:'astra'})} id="astra" position={[.2,0,2.6]} size={[2.1,.55,1.4]} color="#81a865" label="ASTRA 控制域"/>
  <Block id="gpu-01" position={[3.5,0,-1.3]} size={[2.35,.55,2.4]} color="#aac780" label="GPU TEE · 受保护会话"/>
  <Block id="argus" position={[3.5,0,2.6]} size={[2.3,.55,1.4]} color="#81a865" label="ARGUS · 运行时观测"/>
  <Paths paths={paths}/>
  <Annotation position={[-2,0,-4.1]} title="独立证明 → 身份与授权 → 密钥释放" detail="组成员策略 / 撤销 / 恢复均需单独验证" color="#d4baef"/>
  <Annotation position={[0,0,4.5]} title="管理关联 ≠ 密码证明链" detail="BMC → HMC → DPU 属管理示意，见带外网络层" color="#aab6bc"/>
 </group>;
 return <group>
  <Block position={[-3,-.2,-1.8]} size={[2.8,.08,2.2]} color="#6b567c" opacity={.18}/>
  <Block position={[0,-.2,1]} size={[8.4,.08,2.5]} color="#6b567c" opacity={.18}/>
  <Annotation position={[-1.9,.3,-4.7]} title="TENANT EXECUTION DOMAIN" detail="Realm + GPU TEE · 不共享一把机架密钥" color="#d2b5ed"/>
  <Block onActivate={()=>update({securityGuide:'confidential'})} id="realm" position={[-3,.2,-1.8]} size={[2,.5,1.35]} color="#a58bc4" label="VERA · REALM VM"/>
  <Block id="io" position={[0,.2,-1.8]} size={[1.85,.4,1.35]} color="#8a779f" label="TRUSTED DEVICE I/O"/>
  <Block id="cx9-001" position={[3,.2,-1.8]} size={[1.8,.5,1.35]} color="#628fae" label="CONNECTX-9"/>
  <Block id="gpu-01" position={[-3,.2,1]} size={[1.8,.5,1.5]} color="#92b864" label="RUBIN · GPU TEE"/>
  <Block id="switch-01" position={[0,.2,1]} size={[1.55,.4,1.5]} color="#b3788c" label="NVLINK FABRIC"/>
  <Block id="gpu-02" position={[3,.2,1]} size={[1.8,.5,1.5]} color="#92b864" label="RUBIN · GPU TEE"/>
  <Block onActivate={()=>update({securityGuide:'astra'})} id="astra" position={[4.8,.2,-3.3]} size={[1.8,.5,1.4]} color="#82a95d" label="DPU · ASTRA"/>
  <Block id="argus" position={[4.8,.2,-.7]} size={[1.5,.5,.7]} color="#82a95d" label="DOCA ARGUS"/>
  <Block id="sentry" position={[0,.2,3.7]} size={[2.4,.5,1.15]} color="#a27da9" label="SENTRY · AGENT 治理"/>
  <Block id="imex" position={[-3.2,.2,3.7]} size={[2.1,.5,1.15]} color="#8a779f" label="IMEX · 映射授权"/>
  <Paths paths={paths}/>
  <Annotation position={[1.1,.1,5]} title="链路加密 / 访问授权 / 运行时治理" detail="独立机制 · 不推断 Argus 能读取 Realm 私有内存" color="#d4b5e4"/>
 </group>;
}
