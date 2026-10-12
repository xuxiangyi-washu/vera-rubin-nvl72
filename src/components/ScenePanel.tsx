import {lazy,Suspense,useEffect,useState} from 'react';
import {Images,Palette,ArrowLeftRight,Expand,Eye,RotateCcw,SlidersHorizontal,ChevronLeft,ChevronRight,Play,Pause} from 'lucide-react';
import {useExplorer} from '../stores/useExplorer';
import {usePageVisible} from '../hooks/usePageVisible';
import {useRenderer} from '../stores/useRenderer';
import {views} from './Sidebar';
import {PhotoStage,ScenePhotoCard} from './HardwarePhoto';
import DiagramFallback from './DiagramFallback';
import {catalog,hardwareCounts} from '../data';
import {linkNames,linkColors,pad} from '../utils/format';
import {controlTypes,linkRoles} from '../utils/link-semantics.mjs';
import type {LinkType} from '../models/types';
const SceneCanvas=lazy(()=>import('../scenes/SceneCanvas'));
function Tool({label,pressed,onClick,children}:{label:string;pressed?:boolean;onClick:()=>void;children:React.ReactNode}){return <button className={`tool-button ${pressed?'active':''}`} aria-label={label} title={label} aria-pressed={pressed} onClick={onClick}>{children}</button>}
export default function ScenePanel(){
 const s=useExplorer(),render=useRenderer(),[filters,setFilters]=useState(false);const active=views.find(v=>v.id===s.view)!;
 const visible=usePageVisible();
 const ready=render.status==='ready'&&!s.photoMode,attempt=['loading','ready'].includes(render.status)&&!s.photoMode;
 useEffect(()=>{if(render.status!=='loading'||!visible)return;const id=window.setTimeout(()=>{if(import.meta.env.DEV)document.documentElement.dataset.qaRenderError='可见页面初始化超时';render.dispatch({type:'failed',generation:render.generation})},15000);return()=>window.clearTimeout(id)},[render.status,render.generation,render.dispatch,visible]);
 const retry=()=>{s.update({photoMode:false});render.dispatch({type:'retry'})};
 const tray=(d:number)=>{const index=(s.trayIndex+d+hardwareCounts.rack.compute)%hardwareCounts.rack.compute;s.select(`tray-${pad(index)}`,index)};
 return <section className={`scene-panel renderer-${render.status}`} aria-label={`${active.label}场景`} data-render-status={render.status}>
 <div className="scene-toolbar"><div className="scene-title"><active.icon size={16}/><strong>{active.label}</strong>{s.view==='tray'&&<span>托盘 {s.trayIndex+1} / {hardwareCounts.rack.compute}</span>}</div><div className="scene-tools">
 {s.view==='tray'&&<><Tool label="上一个托盘" onClick={()=>tray(-1)}><ChevronLeft size={16}/></Tool><Tool label="下一个托盘" onClick={()=>tray(1)}><ChevronRight size={16}/></Tool></>}
 <Tool label="官方产品图" pressed={s.photoMode} onClick={()=>{const photoMode=!s.photoMode;s.update({photoMode});render.dispatch(photoMode?{type:'2d'}:{type:'retry'})}}><Images size={16}/></Tool>
 {ready&&<><Tool label="写实材质" pressed={s.realistic} onClick={()=>s.update({realistic:!s.realistic})}><Palette size={16}/></Tool>{s.view==='rack'&&<Tool label="切换前后视角" pressed={s.rear} onClick={()=>s.update({rear:!s.rear})}><ArrowLeftRight size={16}/></Tool>}{['rack','tray'].includes(s.view)&&<Tool label="展开结构" pressed={s.exploded} onClick={()=>s.update({exploded:!s.exploded})}><Expand size={16}/></Tool>}<Tool label="显示标签" pressed={s.showLabels} onClick={()=>s.update({showLabels:!s.showLabels})}><Eye size={16}/></Tool><Tool label="重置视角" onClick={()=>s.update({resetToken:s.resetToken+1})}><RotateCcw size={16}/></Tool></>}
 <Tool label="过滤器" pressed={filters} onClick={()=>setFilters(!filters)}><SlidersHorizontal size={16}/></Tool></div></div>
 {!ready&&<div className="scene-status"><div role="status"><strong>{render.status==='loading'?'正在初始化三维':render.status==='lost'?'三维上下文已丢失，已切换二维':render.status==='failed'?'三维初始化未完成，已切换二维':'当前使用二维内容'}</strong><p>{render.status==='failed'||render.status==='lost'?'原因尚未确认。可继续查询组件、阅读证据和操作NCCL数值演示。':'二维和三维使用同一份组件与连接数据。'}</p></div><div className="state-actions">{render.status!=='loading'&&<button onClick={retry}>重试三维</button>}<button disabled={render.status==='2d'&&!s.photoMode} onClick={()=>{s.update({photoMode:false});render.dispatch({type:'2d'})}}>使用二维</button></div></div>}
 {ready&&<div className="state-actions scene-mode"><span>三维已加载 · 拖动旋转 / 滚轮缩放 / 右键平移</span><button onClick={()=>render.dispatch({type:'2d'})}>使用二维</button></div>}
 {filters&&<div className="scene-filter"><label>模块类型<select aria-label="模块类型" value={s.moduleFilter} onChange={e=>s.update({moduleFilter:e.target.value})}><option value="all">全部模块</option>{['gpu','cpu','nic','dpu','switch'].map(type=><option key={type} value={type}>{catalog[type].name}</option>)}</select></label><label>流动类型<select aria-label="流动类型" value={s.flow} onChange={e=>s.update({flow:e.target.value})}><option value="all">全部</option><option value="compute">计算载荷（不含管理边）</option><option value="control">控制 / 证明关系</option><option value="storage">存储数据</option><option value="infrastructure">电力 / 冷却</option></select></label><label><input type="checkbox" checked={s.lowPower} onChange={e=>s.update({lowPower:e.target.checked})}/>节能模式</label></div>}
 {s.photoMode?<div className="photo-container"><PhotoStage/></div>:attempt?<div className={`canvas-container ${ready?'':'is-loading'}`}><div className="render-stage"><Suspense fallback={null}><SceneCanvas key={render.generation} generation={render.generation}/></Suspense>{ready&&s.view!=='inference'&&<ScenePhotoCard/>}</div>{ready&&s.view==='fabric'&&s.fabricMode==='topology'&&<button className="canvas-option" aria-pressed={s.allPaths} onClick={()=>s.update({allPaths:!s.allPaths})}>{s.allPaths?'显示选中GPU路径':'显示72 GPU全拓扑'}</button>}{ready&&s.view==='network'&&<div className="network-toggle">{(['ethernet','infiniband'] as const).map(n=><button key={n} aria-pressed={s.network===n} className={s.network===n?'active':''} onClick={()=>s.update({network:n})}>{n==='ethernet'?'Spectrum-X':'Quantum-X800'}</button>)}</div>}{ready&&s.view!=='inference'&&<div className="canvas-bottom"><span>路径为逻辑教学；控制边不传送GPU载荷。</span><button aria-pressed={s.animated} className="animation-button" onClick={()=>s.update({animated:!s.animated})}>{s.animated?<Pause size={14}/>:<Play size={14}/>} {s.animated?'暂停流动':'演示流动'}</button></div>}</div>:<DiagramFallback/>}
 <div className="connection-legend"><span>连接图层</span>{(Object.keys(linkNames) as LinkType[]).filter(t=>t!=='trust'||['security','trust'].includes(s.view)).map(type=><button key={type} aria-pressed={s.layers[type]} className={s.layers[type]?'':'disabled'} onClick={()=>s.toggleLayer(type)} title={linkRoles[type]}><i className={controlTypes.has(type)?'control-line':''} style={{background:linkColors[type]}}/>{s.layers[type]?'✓ ':''}{linkNames[type]}{controlTypes.has(type)?'（控制虚线）':''}</button>)}</div>
 </section>;
}
