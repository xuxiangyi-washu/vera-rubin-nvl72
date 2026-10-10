import { useEffect, useState } from 'react';
import { ArrowUpRight, X, Search } from 'lucide-react';
import { catalog, sources } from '../data';
import { SourceLink, Status } from './Inspector';
import images from '../../research/official-assets.json';

export default function ResearchModal({close}:{close:()=>void}){
 const [tab,setTab]=useState('facts'),[query,setQuery]=useState(''),[status,setStatus]=useState('all');
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};document.addEventListener('keydown',handler);const active=document.activeElement as HTMLElement;document.getElementById('close-research')?.focus();return()=>{document.removeEventListener('keydown',handler);active?.focus()}},[close]);
 const facts=Object.entries(catalog).flatMap(([key,m])=>m.specs.map(f=>({key,model:m,...f}))).filter(f=>(status==='all'||f.confidence===status)&&`${f.model.name} ${f.label} ${f.value}`.toLowerCase().includes(query.toLowerCase()));
 return <div className="modal-backdrop" onClick={close}><section className="research-modal" role="dialog" aria-modal="true" aria-labelledby="research-title" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Tab'){const elements=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button,a,input,select')).filter(el=>!el.hasAttribute('disabled'));const first=elements[0],last=elements.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}}>
   <header><div><span className="eyebrow">EVIDENCE LIBRARY / 2026.10.10</span><h2 id="research-title">资料、来源与公开边界</h2></div><button id="close-research" className="icon-button" onClick={close} aria-label="关闭资料库"><X size={22}/></button></header>
   <div className="research-tabs">{[['facts','资料调研摘要'],['sources','来源清单'],['images','官方原图']].map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={id===tab?'active':''}>{label}</button>)}</div>
   <div className="research-body">
    {tab==='facts'?<><div className="research-filter"><label className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索模块、规格或协议" aria-label="搜索调研资料"/></label><select value={status} onChange={e=>setStatus(e.target.value)} aria-label="可信度筛选"><option value="all">全部证据状态</option>{['已确认','冲突','待核实'].map(s=><option key={s}>{s}</option>)}</select></div>
      <p className="research-intro">已读取文档 A、B、C。当前官方资料与用户给定口径不一致时保留差异。实体位置、线束和数据流是教学示意；所有事实按来源条件成立。</p>
      <div className="table-scroll"><table><thead><tr><th>模块 / 官方型号</th><th>关键规格</th><th>连接与功能</th><th>证据 / 定位</th><th>可信度</th></tr></thead><tbody>{facts.map((f,i)=><tr key={i}><td><strong>{f.model.name}</strong><small>{f.model.model}</small></td><td>{f.label}<strong>{f.value}</strong></td><td>{f.model.connections[0]}<small>{f.model.functions[0]}</small></td><td className="source-inline">{f.source.map(id=><SourceLink key={id} id={id}/>)}</td><td><Status value={f.confidence}/></td></tr>)}</tbody></table>{!facts.length&&<p className="empty-state">没有匹配的事实记录。</p>}</div></>:
    tab==='sources'?<div className="source-grid">{sources.map(s=><article className="source-card" key={s.id}><span className="mono">{s.id}</span><h3>{s.title}</h3><p>{s.section}</p>{s.url&&<a href={s.url} target="_blank" rel="noreferrer">打开官方资料 <ArrowUpRight size={13}/></a>}</article>)}</div>:
    <><p className="research-intro">图片来自 NVIDIA 官方，版权归 NVIDIA 所有。这里只外链引用，项目包不含原图副本；3D 场景采用自行构建的参数化几何体。</p><div className="official-grid">{images.map(img=><article key={img.id}><a href={img.url} target="_blank" rel="noreferrer" className="official-image-link"><img src={img.url} alt={img.label} loading="lazy" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.parentElement!.classList.add('image-unavailable')}}/><span className="image-fallback">图片未能加载 · 点击打开原图</span></a><h3>{img.label}</h3><small>{img.copyright}</small><a href={img.sourcePage} target="_blank" rel="noreferrer">官方来源 <ArrowUpRight size={12}/></a></article>)}</div></>}
   </div>
 </section></div>;
}
