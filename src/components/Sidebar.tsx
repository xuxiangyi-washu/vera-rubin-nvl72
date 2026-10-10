import { Box, Layers3, Network, ShieldCheck, GitBranch, CircuitBoard, Workflow, Search, ChevronRight, ChevronDown, BookOpen, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useExplorer } from '../stores/useExplorer';
import { catalog, topology } from '../data';
import type { ViewMode, Entity } from '../models/types';

export const views:{id:ViewMode;label:string;english:string;icon:typeof Box}[]=[
 {id:'rack',label:'整柜概览',english:'Rack overview',icon:Box},
 {id:'tray',label:'计算托盘',english:'Compute tray',icon:CircuitBoard},
 {id:'fabric',label:'NVLink 交换网络',english:'Scale-up fabric',icon:Layers3},
 {id:'network',label:'三级网络',english:'Network topology',icon:Network},
 {id:'security',label:'机密计算',english:'Confidential computing',icon:ShieldCheck},
 {id:'trust',label:'安全信任链',english:'Trust & attestation',icon:GitBranch},
 {id:'inference',label:'NCCL 推理动画',english:'Distributed inference',icon:Workflow},
];
const categories=[['compute','计算托盘','18'],['gpu','Rubin GPU','72'],['cpu','Vera CPU','36'],['switch','NVLink Switch','36'],['nic','ConnectX-9','144'],['dpu','BlueField-4 DPU','18']];
export default function Sidebar({openResearch}:{openResearch:()=>void}){
 const {view,setView,selectedId,select,query,update}=useExplorer();
 const [expanded,setExpanded]=useState<string|null>(null);
 const choose=(entity:Entity)=>{
  select(entity.id,entity.trayIndex);update({query:'',moduleFilter:'all'});
  if(entity.type==='astra'){setView('trust');update({securityGuide:'astra'});return;}
  if(entity.type==='sentry'){setView('trust');update({securityGuide:'sentry'});return;}
  if(['compute','gpu','cpu','nic','dpu'].includes(entity.type)){if(!(view==='fabric'&&entity.type==='gpu'))setView('tray')}
  else if(['switch','switchTray'].includes(entity.type))setView('fabric');
  else if(['astra','realm','sentry','argus','imex'].includes(entity.type))setView('security');
  else setView('rack');
 };
 const normalized=query.toLowerCase().replace(/\s+/g,'');
 const results=topology.entities.filter(e=>`${e.id}${e.name}${e.model}`.toLowerCase().replace(/\s+/g,'').includes(normalized));
 return <aside className="sidebar">
  <div className="sidebar-project"><div className="project-mark"><i/><i/><i/></div><div><strong>NVL72</strong><span>ARCHITECTURE EXPLORER</span></div></div>
  <div className="sidebar-content"><div className="nav-caption">探索视图 <span>01—07</span></div>
  <nav aria-label="场景视图">{views.map(({id,label,english,icon:Icon},i)=><button key={id} className={`nav-item ${view===id?'active':''}`} onClick={()=>{setView(id);if(id==='rack')select('rack-01');else if(id==='tray')select(`tray-${String(useExplorer.getState().trayIndex+1).padStart(2,'0')}`);else if(id==='fabric'){if(!selectedId.startsWith('gpu-'))select('gpu-01',0);}else if(id==='network')select('external');else if(id==='security')select('realm');else if(id==='inference')select('gpu-01',0);else select('root')}}><Icon size={19}/><span>{label}<small>{english}</small></span><b>{String(i+1).padStart(2,'0')}</b></button>)}</nav>
  <div className="sidebar-divider"/>
  <div className="nav-caption">模块目录 <span>{topology.entities.length}</span></div>
  <label className="search-box"><Search size={15}/><input value={query} onChange={e=>update({query:e.target.value})} placeholder="搜索 GPU、托盘、DPU…" aria-label="搜索模块"/><kbd>/</kbd></label>
  {query?<div className="search-results" aria-live="polite"><small>找到 {results.length} 个实体</small>{results.slice(0,100).map(e=><button key={e.id} onClick={()=>choose(e)}><span>{e.name}</span><small>{e.id}</small></button>)}{!results.length&&<p>没有匹配的模块。试试 gpu-01 或 cx9-001。</p>}</div>:<div className="module-tree">{categories.map(([type,label,count])=><div key={type}><button className="tree-row" aria-expanded={expanded===type} onClick={()=>setExpanded(expanded===type?null:type)}>{expanded===type?<ChevronDown size={13}/>:<ChevronRight size={13}/>}<span className="type-dot" style={{background:catalog[type].color}}/><span>{label}</span><b>{count}</b></button>{expanded===type&&<div className="tree-children">{topology.entities.filter(e=>e.type===type).map(e=><button key={e.id} className={selectedId===e.id?'active':''} onClick={()=>choose(e)}>{e.id.toUpperCase()}</button>)}</div>}</div>)}
   <div className="security-shortcuts"><button onClick={()=>update({securityGuide:'platform'})}>平台全景<ChevronRight size={11}/></button><button onClick={()=>update({securityGuide:'tor'})}>管理ToR<ChevronRight size={11}/></button><button onClick={()=>update({securityGuide:'c2c'})}>NVLink-C2C<ChevronRight size={11}/></button><button onClick={()=>update({securityGuide:'linkcrypto'})}>NVLink加密<ChevronRight size={11}/></button><button onClick={()=>update({securityGuide:'scalein'})}>Scale-In<ChevronRight size={11}/></button><button onClick={()=>update({securityGuide:'oasp'})}>Agent Safety<ChevronRight size={11}/></button>{['astra','realm','argus','sentry','imex'].map(id=><button key={id} onClick={()=>choose(topology.entities.find(e=>e.id===id)!)}>{id.toUpperCase()}<ChevronRight size={11}/></button>)}</div>
  </div>}
  </div>
  <div className="sidebar-bottom"><button onClick={openResearch}><BookOpen size={16}/><span>资料与核验</span><ExternalLink size={13}/></button><small><span className="small-dot"/> 证据驱动 · 参数化仿真</small></div>
 </aside>;
}
