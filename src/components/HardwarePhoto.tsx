import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Images, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { getComponentPhotos, viewPhotoTypes, type OfficialAsset } from '../data/photos';
import { catalog, entityById, topology } from '../data';
import { useExplorer } from '../stores/useExplorer';

export function OfficialImage({asset,className='',eager=false}:{asset:OfficialAsset;className?:string;eager?:boolean}){
 const [failed,setFailed]=useState(false),[loaded,setLoaded]=useState(false);
 const imageRef=useRef<HTMLImageElement>(null);
 const src=eager?asset.url:(asset.previewUrl??asset.url);
 useEffect(()=>{const image=imageRef.current;setFailed(Boolean(image?.complete&&image.naturalWidth===0));setLoaded(Boolean(image?.complete&&image.naturalWidth>0))},[src]);
 return <div className={`official-photo ${className}`}>
  {failed?<div className="photo-unavailable"><Images size={24}/><span>官方图片暂未加载</span><a href={asset.url} target="_blank" rel="noreferrer">打开原始图片 <ArrowUpRight size={12}/></a></div>:<><img ref={imageRef} key={src} src={src} alt={asset.label} onLoad={()=>setLoaded(true)} loading={eager?'eager':'lazy'} referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>{!loaded&&<span className="photo-loading">正在载入官方原图…</span>}</>}
 </div>;
}
export function ComponentPhoto({type}:{type:string}){
 const asset=getComponentPhotos(type)[0],update=useExplorer(s=>s.update);
 if(!asset)return null;
 return <figure className="component-photo"><button className="component-photo-open" aria-label="放大官方组件图片" onClick={()=>update({photoMode:true})}><OfficialImage asset={asset}/><span><ZoomIn size={12}/> 官方产品图</span></button><figcaption>{asset.copyright}<a href={asset.sourcePage} target="_blank" rel="noreferrer">来源 <ArrowUpRight size={10}/></a></figcaption></figure>;
}
export function ScenePhotoCard(){
 const {view,selectedId,update}=useExplorer();
 const entity=entityById.get(selectedId),selectedPhotos=getComponentPhotos(entity?.type??'');
 const asset=(selectedPhotos.length?selectedPhotos:getComponentPhotos(viewPhotoTypes[view]))[0];
 if(!asset)return null;
 return <button className="scene-photo-card" onClick={()=>update({photoMode:true})} aria-label="查看当前组件官方产品图"><OfficialImage asset={asset}/><span><Images size={12}/> 官方外观参考 <ArrowUpRight size={11}/></span></button>;
}
export function PhotoStage(){
 const {view,selectedId,trayIndex,select}=useExplorer();
 const entity=entityById.get(selectedId)!;
 const selectedPhotos=getComponentPhotos(entity.type);
 const images=selectedPhotos.length?selectedPhotos:getComponentPhotos(viewPhotoTypes[view]);
 const [index,setIndex]=useState(0),[zoom,setZoom]=useState(1);
 useEffect(()=>{setIndex(0);setZoom(1)},[selectedId,view]);
 const asset=images[index]??images[0];
 const groups=['compute','gpu','cpu','nic','dpu','switchTray'];
 const chooseType=(type:string)=>{
  const match=topology.entities.find(e=>e.type===type&&(e.trayIndex===trayIndex||type==='switchTray'))??topology.entities.find(e=>e.type===type);
  if(match)select(match.id,match.trayIndex);
 };
 if(!asset)return <div className="photo-stage">该模块暂无可核验的官方产品图。</div>;
 return <div className="photo-stage">
  <div className="photo-stage-header"><div><span className="eyebrow">OFFICIAL HARDWARE REFERENCE</span><strong>{asset.label}</strong></div><div className="photo-zoom"><button onClick={()=>setZoom(Math.max(.75,zoom-.25))} aria-label="缩小原图"><ZoomOut size={15}/></button><button onClick={()=>setZoom(1)} aria-label="复位原图缩放"><RotateCcw size={14}/></button><button onClick={()=>setZoom(Math.min(3,zoom+.25))} aria-label="放大原图"><ZoomIn size={15}/></button></div></div>
  <div className="photo-stage-types">{groups.map(type=><button key={type} className={type===entity.type?'active':''} onClick={()=>chooseType(type)}>{catalog[type].name}</button>)}</div>
  <div className="photo-stage-scroll"><div className="photo-stage-art" style={{width:`${zoom*100}%`,minHeight:zoom>1?`${zoom*100}%`:'100%'}}><OfficialImage key={asset.id} asset={asset} eager/></div></div>
  <div className="photo-stage-thumbs">{images.map((item,i)=><button key={item.id} className={i===index?'active':''} onClick={()=>{setIndex(i);setZoom(1)}}><OfficialImage asset={item}/><span>{item.label}</span></button>)}</div>
  <div className="photo-stage-credit"><span>图片来自 NVIDIA 官方，版权归 NVIDIA 所有。产品图含照片或官方渲染，非可旋转 CAD；图中首发规格请对照证据面板。</span><a href={asset.sourcePage} target="_blank" rel="noreferrer">{asset.copyright} · 来源 <ArrowUpRight size={12}/></a></div>
 </div>;
}
