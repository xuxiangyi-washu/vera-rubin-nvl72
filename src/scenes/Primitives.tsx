import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Edges, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useExplorer } from '../stores/useExplorer';
import { catalog, entityById } from '../data';
import { linkColors } from '../utils/format';
import type { LinkType, Vec3 } from '../models/types';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export function Block({ id, position, size, color, label, muted = false, opacity = 1, onActivate }: {
  id?: string; position: Vec3; size: Vec3; color: string; label?: string; muted?: boolean; opacity?: number; onActivate?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const selected = useExplorer(s => s.selectedId === id);
  const showLabels = useExplorer(s => s.showLabels);
  const select = useExplorer(s => s.select);
  const activate = (event: ThreeEvent<MouseEvent>) => {
    if (!id) return;
    event.stopPropagation(); select(id, entityById.get(id)?.trayIndex); onActivate?.();
  };
  return <group position={position}>
    <mesh geometry={boxGeometry} scale={size} onClick={activate}
      onPointerOver={e => { if(id) {e.stopPropagation();setHovered(true);document.body.style.cursor='pointer';} }}
      onPointerOut={() => {setHovered(false);document.body.style.cursor='auto';}}>
      <meshStandardMaterial color={color} metalness={muted ? .65 : .48} roughness={.35} transparent={opacity < 1} opacity={opacity}
        emissive={selected ? '#82bc31' : hovered ? color : '#000000'} emissiveIntensity={selected ? .42 : .18} />
      {(selected || hovered) && <Edges color={selected ? '#c4ff7a' : '#f4fce9'} threshold={15} />}
    </mesh>
    {label && showLabels && <Html zIndexRange={[5,0]} center position={[0, size[1] / 2 + .1, 0]} distanceFactor={12} style={{ pointerEvents:'none' }}><span className="model-label">{label}</span></Html>}
  </group>;
}
export interface InstanceItem { id?: string; position: Vec3; size: Vec3; color: string }
export function InstanceBank({ items, interactive = true }: { items: InstanceItem[]; interactive?: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const selectedId = useExplorer(s=>s.selectedId);
  const select = useExplorer(s=>s.select);
  const [hover, setHover] = useState<number | undefined>();
  const temp = useMemo(()=>new THREE.Object3D(),[]);
  useLayoutEffect(()=>{
    if(!mesh.current)return;
    items.forEach((item,i)=>{
      temp.position.set(...item.position);temp.scale.set(...item.size);temp.updateMatrix();
      mesh.current.setMatrixAt(i,temp.matrix);
      mesh.current.setColorAt(i,new THREE.Color(item.id===selectedId ? '#e0ff9d' : i===hover ? '#ffffff' : item.color));
    });
    mesh.current.instanceMatrix.needsUpdate=true;
    if(mesh.current.instanceColor)mesh.current.instanceColor.needsUpdate=true;
    mesh.current.computeBoundingSphere();
  },[items,selectedId,hover,temp]);
  if(!items.length)return null;
  return <instancedMesh ref={mesh} args={[boxGeometry,undefined,items.length]}
    onClick={e=>{const item=items[e.instanceId??-1];if(interactive&&item?.id){e.stopPropagation();select(item.id,entityById.get(item.id)?.trayIndex)}}}
    onPointerOver={e=>{if(interactive){e.stopPropagation();setHover(e.instanceId);document.body.style.cursor='pointer'}}}
    onPointerOut={()=>{setHover(undefined);document.body.style.cursor='auto'}}>
    <meshStandardMaterial metalness={.55} roughness={.38}/>
  </instancedMesh>;
}
export interface PathSpec { points: Vec3[]; type: LinkType; dashed?: boolean }
export function Paths({ paths, opacity = .6 }: { paths: PathSpec[]; opacity?: number }) {
  const layers = useExplorer(s=>s.layers), flow=useExplorer(s=>s.flow), animated=useExplorer(s=>s.animated||(s.view==='inference'&&s.inferencePlaying)), lowPower=useExplorer(s=>s.lowPower);
  const filtered=useMemo(()=>paths.filter(p=>layers[p.type] && (flow==='all' || (flow==='compute'&&['nvlink','c2c','scaleout','pcie'].includes(p.type)) || (flow==='control'&&['astra','management','trust'].includes(p.type)) || (flow==='storage'&&p.type==='storage') || (flow==='infrastructure'&&['power','cooling'].includes(p.type)))),[paths,layers,flow]);
  return <>
    {filtered.map((p,i)=><Line key={`${i}-${p.type}`} points={p.points} color={linkColors[p.type]} lineWidth={p.type==='cooling'?2:1.25} transparent opacity={opacity} dashed={p.dashed} dashSize={.12} gapSize={.08}/>) }
    {animated&&<FlowParticles paths={filtered.slice(0,lowPower?16:96)}/>}
  </>;
}
function FlowParticles({paths}:{paths:PathSpec[]}) {
  const ref=useRef<THREE.InstancedMesh>(null!);
  const state=useMemo(()=>({dummy:new THREE.Object3D(),curves:paths.map(p=>new THREE.CatmullRomCurve3(p.points.map(v=>new THREE.Vector3(...v)),false,'centripetal'))}),[paths]);
  useLayoutEffect(()=>{if(!ref.current)return;paths.forEach((p,i)=>ref.current.setColorAt(i,new THREE.Color(linkColors[p.type])));if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true},[paths]);
  useFrame(({clock})=>{if(!ref.current)return;state.curves.forEach((curve,i)=>{state.dummy.position.copy(curve.getPoint((clock.elapsedTime*.18+i*.17)%1));state.dummy.updateMatrix();ref.current.setMatrixAt(i,state.dummy.matrix)});ref.current.instanceMatrix.needsUpdate=true});
  if(!paths.length)return null;
  return <instancedMesh ref={ref} args={[undefined,undefined,paths.length]}><sphereGeometry args={[.046,6,6]}/><meshBasicMaterial toneMapped={false}/></instancedMesh>;
}
export function Chip({id,position,size=[.9,.22,.8],label}:{id:string;position:Vec3;size?:Vec3;label?:string}) {
  const entity=entityById.get(id)!;
  const realistic=useExplorer(s=>s.realistic);
  const surface=realistic?(['gpu','cpu'].includes(entity.type)?'#4c554b':entity.type==='nic'?'#666e61':'#3c493c'):catalog[entity.type].color;
  return <group><Block position={[position[0],position[1]-.07,position[2]]} size={[size[0]+.15,.08,size[2]+.15]} color="#29402d"/>
    <Block id={id} position={position} size={size} color={surface} label={label}/>
  </group>;
}
export function Annotation({position,title,detail,color='#d1ddc8'}:{position:Vec3;title:string;detail?:string;color?:string}) {
  const show=useExplorer(s=>s.showLabels);
  return show?<Html zIndexRange={[5,0]} position={position} center style={{pointerEvents:'none'}}><div className="scene-annotation" style={{borderColor:color}}><strong style={{color}}>{title}</strong>{detail&&<small>{detail}</small>}</div></Html>:null;
}
