import { Component, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useExplorer } from '../stores/useExplorer';
import { useCompact } from '../hooks/useCompact';
import RackScene from './RackScene';
import TrayScene from './TrayScene';
import FabricScene from './FabricScene';
import NetworkScene from './NetworkScene';
import SecurityScene from './SecurityScene';
import InferenceScene from './InferenceScene';
import type { Vec3, ViewMode } from '../models/types';

const cameraPositions:Record<ViewMode,Vec3>={rack:[9,4,15],tray:[8,10,11],fabric:[0,13,10],network:[7,9,22],security:[8,11,13],trust:[3,11,14],inference:[5,12,16]};
function CameraSetup(){
 const {view,rear,resetToken,fabricMode}=useExplorer(),{camera,invalidate}=useThree();
 useEffect(()=>{const p=view==='fabric'&&fabricMode==='switchTray'?[8,10,12]:cameraPositions[view];camera.position.set(p[0],p[1],rear?-p[2]:p[2]);camera.lookAt(0,0,0);camera.updateProjectionMatrix();invalidate()},[view,rear,resetToken,fabricMode,camera,invalidate]);
 return <OrbitControls key={`${view}-${rear}-${resetToken}-${fabricMode}`} makeDefault enableDamping dampingFactor={.08} minDistance={view==='rack'?7:6} maxDistance={35} maxPolarAngle={Math.PI*.85} target={[0,0,0]}/>;
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<div className="canvas-fallback"><strong>3D 渲染暂不可用</strong><p>可继续用模块目录、来源和拓扑 JSON 查看完整架构。请使用支持 WebGL 的浏览器。</p></div>:this.props.children}
}
export default function SceneCanvas(){
 const {view,animated,lowPower,update,inferencePlaying}=useExplorer(),compact=useCompact();
 const [hidden,setHidden]=useState(document.hidden);
 useEffect(()=>{if(compact)update({lowPower:true})},[compact,update]);
 useEffect(()=>{const f=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',f);return()=>document.removeEventListener('visibilitychange',f)},[]);
 return <SceneBoundary><Canvas dpr={lowPower||compact?1:[1,1.6]} camera={{position:cameraPositions.rack,fov:42,near:.1,far:100}}
   frameloop={(animated||(view==='inference'&&inferencePlaying))&&!hidden?'always':'demand'} gl={{antialias:!lowPower,alpha:true,powerPreference:'high-performance'}}
   fallback={<div className="canvas-fallback">WebGL 不可用。模块目录与资料表仍可使用。</div>}>
   <ambientLight intensity={1.25}/><hemisphereLight intensity={1.2} color="#d7e1dc" groundColor="#364a39"/>
   <directionalLight position={[6,10,8]} intensity={3}/><directionalLight position={[-5,2,-6]} intensity={2} color="#9eb9a1"/>
   <Suspense fallback={null}>
    {view==='rack'?<RackScene/>:view==='tray'?<TrayScene/>:view==='fabric'?<FabricScene/>:view==='network'?<NetworkScene/>:view==='inference'?<InferenceScene/>:<SecurityScene/>}
    <Grid position={[0,view==='rack'?-5.3:view==='network'?-3.2:-.45,0]} args={[40,40]} cellSize={1} cellThickness={.4} cellColor="#314238" sectionSize={5} sectionThickness={.7} sectionColor="#46584a" fadeDistance={35} fadeStrength={1.5} infiniteGrid/>
   </Suspense>
   <CameraSetup/>
   <AdaptiveDpr pixelated/>
   {animated&&!lowPower&&<PerformanceMonitor onDecline={()=>update({lowPower:true})}/>}
   {!compact&&<GizmoHelper alignment="bottom-right" margin={[40,42]}><GizmoViewport axisColors={['#bb707b','#a9d66c','#78a8db']} labelColor="#172218"/></GizmoHelper>}
  </Canvas></SceneBoundary>;
}
