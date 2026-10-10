import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { BookOpen, FileText, Download, Expand, Layers, Images, Palette, ShieldCheck, Pause, Play, RotateCcw, SlidersHorizontal, ArrowLeftRight, ChevronLeft, ChevronRight, Zap, Eye, EyeOff } from 'lucide-react';
import Sidebar, { views } from './components/Sidebar';
import Inspector from './components/Inspector';
import { PhotoStage, ScenePhotoCard } from './components/HardwarePhoto';
import { FabricControls, FabricExplanation } from './components/FabricExchange';
import { InferenceControls, InferenceExplanation } from './components/InferenceControls';
const ResearchModal = lazy(() => import('./components/ResearchModal')); 
const SceneCanvas = lazy(() => import('./scenes/SceneCanvas'));
const SecurityGuide = lazy(() => import('./components/SecurityGuide')); 
import { useExplorer } from './stores/useExplorer';
import { topology, catalog } from './data';
import { downloadJson, linkColors, linkNames, pad } from './utils/format';
import type { LinkType } from './models/types';

const descriptions={rack:'一个机架，完整呈现计算、互联与基础设施。',tray:'两个 Superchip、八个网络端点与一个独立基础设施域。',fabric:'72 GPU 的逻辑全互联，沿交换 fabric 追踪数据路径。',network:'从机架内计算，到跨机架通信与南北向基础设施。',security:'从工作负载内存到互联端点，逐一检查保护边界。',trust:'设备身份、固件测量、授权与受保护 I/O 的依赖关系。',inference:'3个OS域、6个GPU示例：模型分片、NCCL集体通信与逐token解码。'};
const hints={rack:'单击托盘展开 · 拖动旋转 · 滚轮缩放 · 右键平移',tray:'单击芯片查看来源 · 前部 2 × 四端点 SuperNIC 板组',fabric:'点击任意 GPU / Switch 追踪 · 虚线是逻辑可达，非物理直连',network:'对端机柜、交换网络和存储为逻辑示意 · 无真实端口规划',security:'机架级 TEE 不等于单一密钥域 · 安全能力不等于已启用',trust:'箭头为信任依赖关系，非实际握手时序 · 各域独立验证',inference:'教学Ring不是物理布线 · 跨Realm配置适用性待核实 · 非真实模型推理'};
function ToolButton({label,active,onClick,children}:{label:string;active?:boolean;onClick:()=>void;children:React.ReactNode}){return <button aria-label={label} title={label} aria-pressed={active} className={`tool-button ${active?'active':''}`} onClick={onClick}>{children}</button>}
export default function App(){
 const s=useExplorer();const [research,setResearch]=useState(false),[filters,setFilters]=useState(false);
 const closeResearch=useCallback(()=>setResearch(false),[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)){e.preventDefault();document.querySelector<HTMLInputElement>('input[aria-label="搜索模块"]')?.focus()}};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[]);
 const active=views.find(v=>v.id===s.view)!;
 const switchTray=(d:number)=>{const t=(s.trayIndex+d+18)%18;s.update({trayIndex:t});s.select(`tray-${pad(t)}`,t)};
 return <div className="app-shell">
  <Sidebar openResearch={()=>setResearch(true)}/>
  <div className="app-main">
   <header className="topbar"><div className="breadcrumb">NVIDIA 架构研究 <span>/</span> <strong>Vera Rubin NVL72</strong><span className="edition">2026 EDITION</span></div><div className="header-actions"><a className="manual-download" aria-label="使用说明PDF" href="/guides/nvl72-user-guide.pdf" target="_blank" rel="noreferrer"><FileText size={15}/><span>使用说明PDF</span></a><button aria-label="来源与核验" onClick={()=>setResearch(true)}><BookOpen size={15}/><span>来源与核验</span></button><button aria-label="导出拓扑" onClick={()=>downloadJson(topology,'nvl72-topology.json')}><Download size={15}/><span>导出拓扑</span></button></div></header>
   <div className="workspace">
    <main className="explorer-main" data-view={s.view}>
     <div className="page-heading"><div><span className="eyebrow"><span className="small-dot"/> VERA RUBIN / RACK-SCALE AI</span><h1>{s.view==='rack'?'深入每一层架构。':active.label}</h1><p>{descriptions[s.view]}</p></div><div className="snapshot-label"><span>REFERENCE SNAPSHOT</span><strong>2026.10.10</strong><small>公开资料 · 非实时监控</small></div></div>
     {s.view!=='inference'&&<section className="metrics" aria-label="机柜核心数量">{[['72','Rubin GPU','gpu'],['36','Vera CPU','cpu'],['144','ConnectX-9 端点','nic'],['18','BlueField-4 DPU','dpu']].map(([number,label,type])=><button key={type} onClick={()=>{const e=topology.entities.find(e=>e.type===type)!;s.select(e.id,e.trayIndex);s.setView('tray')}}><span className="metric-top"><i style={{background:catalog[type].color}}/>{label}</span><strong>{number}<small>×</small></strong></button>)}</section>}
     {s.view==='fabric'&&<FabricControls/>}
     {s.view==='inference'&&<InferenceControls/>}
     <div className="security-guide-entry"><BookOpen size={21}/><div><strong>{s.view==='inference'?'Realm与跨域通信的安全前提':`${active.label} · 图文详解`}</strong><p>结构与连接、逐步数据流、官方原图和证据</p></div><button onClick={()=>s.update({securityGuide:s.view==='trust'?'astra':s.view==='security'||s.view==='inference'?'confidential':s.view})}>展开图文详解 <ChevronRight size={14}/></button></div>
     {['network','trust','security'].includes(s.view)&&<div className="topic-shortcuts"><button onClick={()=>s.update({securityGuide:'linkcrypto'})}>NVLink加密</button><button onClick={()=>s.update({securityGuide:'scalein'})}>Scale-In</button><button onClick={()=>s.update({securityGuide:'astra'})}>Astra</button><button onClick={()=>s.update({securityGuide:'sentry'})}>DPU中的Sentry</button><button onClick={()=>s.update({securityGuide:'oasp'})}>Open Agent Safety Platform</button></div>}
     <section className="scene-panel" aria-label={`${active.label} 3D 场景`}>
      <div className="scene-toolbar"><div className="scene-title"><active.icon size={16}/><strong>{active.label}</strong><span className="mono">{s.view==='tray'?`TRAY ${pad(s.trayIndex)} / 18`:s.view==='rack'?'RACK 01':active.english.toUpperCase()}</span></div><div className="scene-tools">
       <ToolButton label="官方产品图" active={s.photoMode} onClick={()=>s.update({photoMode:!s.photoMode})}><Images size={16}/></ToolButton>
       <ToolButton label="写实材质" active={s.realistic} onClick={()=>s.update({realistic:!s.realistic,photoMode:false})}><Palette size={16}/></ToolButton>
       {s.view==='tray'&&<><ToolButton label="上一个托盘" onClick={()=>switchTray(-1)}><ChevronLeft size={16}/></ToolButton><ToolButton label="下一个托盘" onClick={()=>switchTray(1)}><ChevronRight size={16}/></ToolButton></>}
       {s.view==='rack'&&<ToolButton label="切换前后视角" active={s.rear} onClick={()=>s.update({rear:!s.rear})}><ArrowLeftRight size={16}/></ToolButton>}
       {['rack','tray'].includes(s.view)&&<ToolButton label="展开结构" active={s.exploded} onClick={()=>s.update({exploded:!s.exploded})}><Expand size={16}/></ToolButton>}
       <ToolButton label="显示标签" active={s.showLabels} onClick={()=>s.update({showLabels:!s.showLabels})}>{s.showLabels?<Eye size={16}/>:<EyeOff size={16}/>}</ToolButton>
       <ToolButton label="重置视角" onClick={()=>s.update({resetToken:s.resetToken+1})}><RotateCcw size={16}/></ToolButton>
       <ToolButton label="过滤器" active={filters} onClick={()=>setFilters(!filters)}><SlidersHorizontal size={16}/></ToolButton>
      </div></div>
      <div className="canvas-container">
       <div className={`render-stage ${s.photoMode?'photo-active':''}`}>{s.photoMode?<PhotoStage/>:<><Suspense fallback={<div className="canvas-fallback">正在加载三维架构…</div>}><SceneCanvas/></Suspense>{s.view!=='inference'&&<ScenePhotoCard/>}</>}</div>
       <div className={`canvas-caption ${s.photoMode?'hidden':''}`}><span className="mono">{s.view==='rack'?'01 / SYSTEM ASSEMBLY':s.view==='tray'?`02 / COMPUTE TRAY ${pad(s.trayIndex)}`:`0${views.findIndex(v=>v.id===s.view)+1} / ${active.english.toUpperCase()}`}</span><span>逻辑模型 · 非工程尺寸</span></div>
       <div className={`canvas-top-right ${s.photoMode?'hidden':''}`}><span className="small-dot"/> {s.animated||(s.view==='inference'&&s.inferencePlaying)?'教学流量动画':'交互式 3D'}{s.lowPower&&<small>节能模式</small>}</div>
       {!s.photoMode&&s.view==='fabric'&&s.fabricMode==='topology'&&<button className={`canvas-option ${s.allPaths?'active':''}`} onClick={()=>s.update({allPaths:!s.allPaths})}><Layers size={14}/>{s.allPaths?'显示选中 GPU 路径':'显示 72 GPU 全拓扑'}</button>}
       {!s.photoMode&&s.view==='network'&&<div className="network-toggle"><button className={s.network==='ethernet'?'active':''} onClick={()=>s.update({network:'ethernet'})}>Spectrum-X</button><button className={s.network==='infiniband'?'active':''} onClick={()=>s.update({network:'infiniband'})}>Quantum-X800</button></div>}
       {filters&&<div className="filter-popover"><strong>场景过滤</strong><label>模块类型<select aria-label="模块类型" value={s.moduleFilter} onChange={e=>s.update({moduleFilter:e.target.value})}><option value="all">全部模块</option>{['gpu','cpu','nic','dpu','switch'].map(type=><option key={type} value={type}>{catalog[type].name}</option>)}</select></label><label>流动类型<select aria-label="流动类型" value={s.flow} onChange={e=>s.update({flow:e.target.value})}><option value="all">全部</option><option value="compute">计算数据</option><option value="control">控制 / 证明</option><option value="storage">存储数据</option><option value="infrastructure">电力 / 冷却</option></select></label><label className="checkbox-label"><input type="checkbox" checked={s.lowPower} onChange={e=>s.update({lowPower:e.target.checked})}/><Zap size={13}/> 节能 / 移动端降级</label>{!['rack','tray','fabric'].includes(s.view)&&<small>模块过滤适用于整柜、托盘与 fabric；当前视图按流动类型过滤。</small>}</div>}
       <div className={`canvas-bottom ${s.photoMode?'hidden':''}`}><span>{hints[s.view]}</span>{s.view!=='inference'&&<button className={s.animated?'animation-button active':'animation-button'} onClick={()=>s.update({animated:!s.animated})}>{s.animated?<Pause size={13}/>:<Play size={13}/>}<span>{s.animated?'暂停流动':'演示流动'}</span></button>}</div>
      </div>
      <div className="connection-legend"><span>连接图层</span>{(Object.keys(linkNames) as LinkType[]).filter(type=>!['trust'].includes(type)||['trust','security'].includes(s.view)).map(type=><button key={type} className={s.layers[type]?'':'disabled'} aria-pressed={s.layers[type]} onClick={()=>s.toggleLayer(type)}><i style={{background:linkColors[type]}}/>{linkNames[type]}</button>)}</div>
     </section>
     {s.view==='fabric'&&<FabricExplanation/>}
     {s.view==='inference'&&<InferenceExplanation/>}
     <div className="architecture-strip"><span><b>18</b> Compute Tray</span><span><b>9</b> Switch Tray</span><span><b>36</b> Switch ASIC</span><span><b>4</b> Cartridge</span><span><b>~5,000</b> 铜缆</span><span><b>4 × 110 kW</b> 额定电源</span></div>
     <div className="evidence-strip"><span className="conflict-marker">◈</span><p><strong>保留公开口径差异</strong> · NVLink 3.0 / 3.6 TB/s 每 GPU，HBM 19.2 / 22 TB/s。单击模块可追溯原文。</p><button onClick={()=>setResearch(true)}>查看证据 <ChevronRight size={13}/></button></div>
    </main>
    <Inspector/>
   </div>
  </div>
  {s.securityGuide&&<Suspense fallback={<div className="modal-backdrop">正在加载安全专题…</div>}><SecurityGuide/></Suspense>}
  {research&&<Suspense fallback={<div className="modal-backdrop">正在加载资料库…</div>}><ResearchModal close={closeResearch}/></Suspense>}
 </div>;
}
