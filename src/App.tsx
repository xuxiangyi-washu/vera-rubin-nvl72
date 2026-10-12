import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { BookOpen, FileText, Download, ChevronRight } from 'lucide-react';
import Sidebar, { views } from './components/Sidebar';
import Inspector from './components/Inspector';
import { FabricControls, FabricExplanation } from './components/FabricExchange';
import { InferenceControls, InferenceExplanation } from './components/InferenceControls';
const ResearchModal = lazy(() => import('./components/ResearchModal')); 
const SecurityGuide = lazy(() => import('./components/SecurityGuide')); 
import { useExplorer } from './stores/useExplorer';
import ScenePanel from './components/ScenePanel';
import {useDialogOpener} from './hooks/useDialogOpener';
import {useInferencePlayback} from './hooks/useInferencePlayback';
import {useExplorationUrl,currentViewUrl} from './hooks/useExplorationUrl';
import QaDiagnostics from './components/QaDiagnostics';
import { topology, catalog, hardwareCounts } from './data';
import { downloadJson } from './utils/format';
import CountSemantics from './components/CountSemantics';

const descriptions={rack:'一个机架，完整呈现计算、互联与基础设施。',tray:'两个 Superchip、八个网络端点与一个独立基础设施域。',fabric:'72 GPU 的逻辑全互联，沿交换 fabric 追踪数据路径。',network:'从机架内计算，到跨机架通信与南北向基础设施。',security:'从工作负载内存到互联端点，逐一检查保护边界。',trust:'设备身份、固件测量、授权与受保护 I/O 的依赖关系。',inference:'3个OS域、6个GPU示例：模型分片、NCCL集体通信与逐token解码。'};
export default function App(){
 const s=useExplorer();const research=s.researchOpen;const setResearch=(open:boolean)=>s.update({researchOpen:open,researchSource:null});const [shareStatus,setShareStatus]=useState('');
 useExplorationUrl();useInferencePlayback();
 const guideOpener=useDialogOpener(Boolean(s.securityGuide)),researchOpener=useDialogOpener(research),dialogOpen=Boolean(s.securityGuide)||research;
 const closeResearch=useCallback(()=>useExplorer.getState().update({researchOpen:false,researchSource:null}),[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='/'&&!useExplorer.getState().securityGuide&&!useExplorer.getState().researchOpen&&!['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement).tagName)){e.preventDefault();document.querySelector<HTMLInputElement>('input[aria-label="搜索模块"]')?.focus()}};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[]);
 const metricCounts=s.view==='tray'?hardwareCounts.tray:hardwareCounts.rack;
 const active=views.find(v=>v.id===s.view)!;

 return <div className="app-shell"><div className="application-content" aria-hidden={dialogOpen||undefined} {...(dialogOpen?{inert:""}:{})}>
  <Sidebar openResearch={()=>s.openEvidence()}/>
  <div className="app-main">
   <header className="topbar"><div className="breadcrumb">NVIDIA 架构研究 <span>/</span> <strong>Vera Rubin NVL72</strong><span className="edition">2026 EDITION</span></div><div className="header-actions"><button aria-label="复制当前视图链接" onClick={async()=>{try{await navigator.clipboard.writeText(currentViewUrl());setShareStatus("当前视图链接已复制；打开后静态恢复")}catch{setShareStatus("复制未完成，可复制地址栏中的视图链接")}}}>复制视图链接</button><a className="manual-download" aria-label="使用说明PDF" href={`${import.meta.env.BASE_URL}guides/nvl72-user-guide.pdf`} target="_blank" rel="noreferrer"><FileText size={15}/><span>使用说明PDF</span></a><button aria-label="来源与核验" onClick={e=>{e.currentTarget.focus();setResearch(true)}}><BookOpen size={15}/><span>来源与核验</span></button><button aria-label="导出拓扑" onClick={()=>downloadJson(topology,'nvl72-topology.json')}><Download size={15}/><span>导出拓扑</span></button></div></header>
   <div className="mobile-controls"><button aria-expanded={s.sidebarOpen} id="toggle-navigation" aria-controls="explorer-navigation" onClick={()=>{s.update({sidebarOpen:!s.sidebarOpen});if(!s.sidebarOpen)requestAnimationFrame(()=>document.getElementById("explorer-navigation")?.scrollIntoView({block:"start"}))}}>{s.sidebarOpen?"收起":"展开"}导航与搜索</button><button aria-expanded={s.inspectorOpen} id="toggle-inspector" aria-controls="component-inspector" onClick={()=>{s.update({inspectorOpen:!s.inspectorOpen});if(!s.inspectorOpen)requestAnimationFrame(()=>document.getElementById("component-inspector")?.scrollIntoView({block:"start"}))}}>{s.inspectorOpen?"收起":"展开"}组件详情</button></div><p className="share-status" role="status">{shareStatus}</p><div className="workspace">
    <main className="explorer-main" data-view={s.view}>
     <div className="page-heading"><div><span className="eyebrow"><span className="small-dot"/> VERA RUBIN / RACK-SCALE AI</span><h1>{s.view==='rack'?'深入每一层架构。':active.label}</h1><p>{descriptions[s.view]}</p></div><div className="snapshot-label"><span>REFERENCE SNAPSHOT</span><strong>2026.10.10</strong><small>公开资料 · 非实时监控</small></div></div>
     {s.view!=='inference'&&<><p className="metrics-scope">{s.view==='tray'?`当前托盘 ${s.trayIndex+1} 的数量`:'整柜数量'}</p><section className="metrics" aria-label={s.view==='tray'?'当前托盘核心数量':'机柜核心数量'}>{[[String(metricCounts.gpu),'Rubin GPU','gpu'],[String(metricCounts.cpu),'Vera CPU','cpu'],[String(metricCounts.nic),'CX9逻辑端点','nic'],[String(metricCounts.dpu),'BlueField-4 DPU','dpu']].map(([number,label,type])=><button key={type} onClick={()=>{const e=topology.entities.find(e=>e.type===type&&(s.view!=='tray'||e.trayIndex===s.trayIndex))!;s.select(e.id,e.trayIndex);s.setView('tray')}}><span className="metric-top"><i style={{background:catalog[type].color}}/>{label}</span><strong>{number}<small>×</small></strong></button>)}</section></>}
     {s.view==='fabric'&&<FabricControls/>}
     {s.view==='inference'&&<InferenceControls/>}
     <div className="security-guide-entry"><BookOpen size={21}/><div><strong>{s.view==='inference'?'Realm与跨域通信的安全前提':`${active.label} · 图文详解`}</strong><p>结构与连接、逐步数据流、官方原图和证据</p></div><button onClick={e=>{e.currentTarget.focus();s.update({securityGuide:s.view==='trust'?'astra':s.view==='security'||s.view==='inference'?'confidential':s.view})}}>展开图文详解 <ChevronRight size={14}/></button></div>
     {['network','trust','security'].includes(s.view)&&<div className="topic-shortcuts"><button onClick={e=>{e.currentTarget.focus();s.update({securityGuide:'linkcrypto'})}}>NVLink加密</button><button onClick={e=>{e.currentTarget.focus();s.update({securityGuide:'scalein'})}}>Scale-In</button><button onClick={e=>{e.currentTarget.focus();s.update({securityGuide:'astra'})}}>Astra</button><button onClick={e=>{e.currentTarget.focus();s.update({securityGuide:'sentry'})}}>DPU中的Sentry</button><button onClick={e=>{e.currentTarget.focus();s.update({securityGuide:'oasp'})}}>Open Agent Safety Platform</button></div>}
     <ScenePanel/>{["rack","tray"].includes(s.view)&&<CountSemantics/>}
     {s.view==='fabric'&&<FabricExplanation/>}
     {s.view==='inference'&&<InferenceExplanation/>}
     <div className="architecture-strip"><span><b>{hardwareCounts.rack.compute}</b> Compute Tray</span><span><b>{hardwareCounts.rack.switchTray}</b> Switch Tray</span><span><b>{hardwareCounts.rack.switch}</b> Switch ASIC</span><span><b>{hardwareCounts.rack.cartridge}</b> Cartridge</span><span><b>~5,000</b> 铜缆</span><span><b>4 × 110 kW</b> 额定电源</span></div>
     <div className="evidence-strip"><span className="conflict-marker">◈</span><p><strong>保留公开口径差异</strong> · NVLink 3.0 / 3.6 TB/s 每 GPU，HBM 19.2 / 22 TB/s。单击模块可追溯原文。</p><button onClick={e=>{e.currentTarget.focus();setResearch(true)}}>查看证据 <ChevronRight size={13}/></button></div>
    </main>
    <div className={`inspector-container ${s.inspectorOpen?"mobile-open":""}`}><Inspector/></div>
   </div>
  </div>
  </div>
  {s.securityGuide&&<div className="guide-underlay" aria-hidden={research||undefined} {...(research?{inert:""}:{})}><Suspense fallback={<div className="modal-backdrop">正在加载安全专题…</div>}><SecurityGuide restoreFocus={guideOpener}/></Suspense></div>}
  {import.meta.env.DEV&&new URLSearchParams(location.search).has("qa")&&<QaDiagnostics/>}
  {research&&<Suspense fallback={<div className="modal-backdrop">正在加载资料库…</div>}><ResearchModal close={closeResearch} restoreFocus={researchOpener}/></Suspense>}
 </div>;
}
