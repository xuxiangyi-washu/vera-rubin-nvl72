import { useState } from 'react';
import { ArrowUpRight, ChevronRight, Cpu, Link2, ShieldCheck } from 'lucide-react';
import { catalog, entityById, sourceById, topology } from '../data';
import { useExplorer } from '../stores/useExplorer';
import type { Confidence } from '../models/types';
import { pad } from '../utils/format';
import { ComponentPhoto } from './HardwarePhoto';

export function Status({value}:{value:Confidence}){return <span className={`status ${value==='已确认'?'confirmed':value==='冲突'?'conflict':'pending'}`}>{value==='已确认'?'●':value==='冲突'?'◈':'○'} {value}</span>}
export function SourceLink({id}:{id:string}){
 const source=sourceById.get(id);if(!source)return <span className="pending">{id} · 来源未找到</span>;
 return source.url?<a href={source.url} target="_blank" rel="noreferrer" title={`${source.title} · ${source.section??''}`}>[{id}] <ArrowUpRight size={10}/></a>:<span title={`${source.title} · ${source.section??''}`}>[{id}]</span>;
}
export default function Inspector(){
 const {selectedId,select,setView,update}=useExplorer();const entity=entityById.get(selectedId)??entityById.get('rack-01')!;const model=catalog[entity.type];
 const [tab,setTab]=useState<'overview'|'sources'>('overview');
 const sourceIds=[...new Set([...model.source,...model.specs.flatMap(s=>s.source)])];
 const adjacent=topology.links.filter(link=>link.source===entity.id||link.target===entity.id);
 return <aside className="inspector" aria-label="模块详情">
   <div className="inspector-caption"><span>COMPONENT INSPECTOR</span><span className="small-dot"/></div>
   <div className="component-heading"><div className="chip-icon" style={{color:model.color}}><Cpu size={28}/></div><div><span className="mono muted">{entity.id.toUpperCase()}</span><h2>{entity.type==='rack'?model.name:entity.name}</h2></div></div>
   <p className="model-name">{model.model}</p>
   <div className="inspector-tabs"><button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>模块概览</button><button className={tab==='sources'?'active':''} onClick={()=>setTab('sources')}>来源 <span>{sourceIds.length}</span></button></div>
   <div className="inspector-scroll">
    {tab==='overview'?<>
      <ComponentPhoto type={entity.type}/>
      {['astra','dpu','realm','io','root','firmware','gpu'].includes(entity.type)&&<button className="guide-inspector-link" onClick={()=>update({securityGuide:['astra','dpu'].includes(entity.type)?'astra':'confidential'})}><ShieldCheck size={15}/>{['astra','dpu'].includes(entity.type)?'Astra 图文详解':'机密计算图文详解'}<ChevronRight size={14}/></button>}
      <p className="component-summary">{model.summary}</p>
      <div className="quantity"><span>系统配置</span><strong>{model.count}</strong></div>
      <div className="section-caption">规格与证据 <span>SPECIFICATIONS</span></div>
      <div className="spec-list">{model.specs.map(f=><div className="spec-item" key={f.label}><div><span>{f.label}</span><Status value={f.confidence}/></div><strong>{f.value}</strong><div className="source-inline">{f.source.map(id=><SourceLink key={id} id={id}/>)}</div></div>)}</div>
      <div className="section-caption">功能 <span>FUNCTION</span></div>
      <ul className="function-list">{model.functions.map(text=><li key={text}>{text}</li>)}</ul>
      <div className="section-caption">连接关系 <Link2 size={13}/></div>
      <div className="connection-list">{model.connections.map(text=><p key={text}><span>↔</span>{text}</p>)}</div>
      {entity.type==='gpu'&&<div className="route-note"><strong>GPU {pad(entity.index??0)} → spine → fabric</strong><p>候选交换集合 SW01–SW36；虚线表示逻辑可达，具体物理对应编号待核实。</p><button className="text-button" onClick={()=>setView('fabric')}>在 fabric 中追踪 <ChevronRight size={13}/></button></div>}
      {entity.type==='nic'&&<div className="route-note"><strong>Scale-Out · 800 Gb/s / 端点</strong><p>目标：Spectrum-X Ethernet 或 Quantum-X800 InfiniBand。实际交换机端口及加密配置未接入。</p><button className="text-button" onClick={()=>setView('network')}>查看跨机架网络 <ChevronRight size={13}/></button></div>}
      {entity.type==='dpu'&&<div className="route-note"><strong>Astra / Argus 能力</strong><p>Astra：设计上由 DPU 管理 SuperNIC。Argus：运行时服务能力说明。两者均没有连接实时健康与策略状态。</p></div>}
      {model.caveat&&<div className="evidence-note"><ShieldCheck size={16}/><p>{model.caveat}</p></div>}
      {!!adjacent.length&&<details className="adjacent"><summary>实体关联 · {adjacent.length} 条逻辑连接</summary>{adjacent.slice(0,30).map(link=>{const other=entityById.get(link.source===entity.id?link.target:link.source)!;return <button key={link.id} onClick={()=>select(other.id,other.trayIndex)}><span>{other.id}</span><ChevronRight size={12}/><small>{link.name}</small></button>})}{adjacent.length>30&&<p>其余连接请导出完整 JSON 查看。</p>}</details>}
    </>:<>
      <p className="component-summary">逐项保留来源口径。“已确认”表示有公开资料支持，未代表实机验证。</p>
      {sourceIds.map(id=>{const s=sourceById.get(id)!;return <article className="source-card" key={id}><span className="mono">{id}</span><h3>{s.title}</h3><p>{s.section}</p>{s.url?<a href={s.url} target="_blank" rel="noreferrer">打开原始资料 <ArrowUpRight size={13}/></a>:<small>已读取本地材料 · 按章节/已核实页码定位</small>}</article>})}
    </>}
   </div>
   <div className="inspector-footer">证据核验 · 2026.10.10 <span>非实时监控</span></div>
 </aside>;
}
