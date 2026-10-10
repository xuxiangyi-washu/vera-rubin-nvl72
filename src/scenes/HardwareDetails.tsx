import { useMemo } from 'react';
import * as THREE from 'three';
import { InstanceBank, Block } from './Primitives';
import type { Vec3 } from '../models/types';

function Tube({points,color='#69746b',radius=.045}:{points:Vec3[];color?:string;radius?:number}){
 const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),[points]);
 return <mesh><tubeGeometry args={[curve,28,radius,6,false]}/><meshStandardMaterial color={color} metalness={.6} roughness={.3}/></mesh>;
}
export function TrayHardwareDetails({lift}:{lift:number}){
 const screwItems=useMemo(()=>[-4.2,4.2].flatMap(x=>Array.from({length:10},(_,i)=>({position:[x,.23,-2.8+i*.62] as Vec3,size:[.065,.025,.065] as Vec3,color:'#bac0b9'}))),[]);
 const memoryItems=useMemo(()=>[-2.15,2.15].flatMap(x=>[-.79,.79].flatMap(dx=>Array.from({length:4},(_,i)=>({position:[x+dx,.21+lift,-1.42+i*.28] as Vec3,size:[.2,.15,.23] as Vec3,color:'#6c7168'})))),[lift]);
 return <group>
  {/* 金属边框、冷板与管路参考官方俯视图，仍使用非工程尺寸的示意布局。 */}
  <InstanceBank items={screwItems} interactive={false}/><InstanceBank items={memoryItems} interactive={false}/>
  <Block position={[0,.18,.75]} size={[7.9,.3,.65]} color="#242b26"/>
  <Block position={[0,.25,1.65]} size={[.95,.35,1.2]} color="#737a73"/>
  {[-1,1].map(side=><group key={side}>
   <Tube points={[[side*4.0,.24,-3],[side*4.0,.34,-1.8],[side*3.65,.42,-.1],[side*3.65,.35,.65],[side*.55,.35,.65]]} color="#333b35" radius={.075}/>
   <Tube points={[[side*2.9,.55+lift,-2.05],[side*2.9,.55+lift,-1.35],[side*2.45,.49+lift,-.55],[side*2.15,.49+lift,-.55]]} color="#90988d" radius={.055}/>
   <Tube points={[[side*1.35,.55+lift,-2.05],[side*1.35,.49+lift,-1.35],[side*1.75,.49+lift,-.55]]} color="#3a443c" radius={.065}/>
   <Tube points={[[side*.32,.1,3.24],[side*.5,.1,3.51],[side*3.8,.1,3.51],[side*4.16,.1,3.2]]} color="#acaa95" radius={.07}/>
   <Block position={[side*4.05,.18,-3.19]} size={[.32,.28,.28]} color="#b9c1b4"/>
  </group>)}
 </group>;
}
