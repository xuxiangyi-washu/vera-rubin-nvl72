import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { SourceLink } from './Inspector';
import { securityRelations, type GuideFact } from '../data/security-guides';

export function Evidence({ids}:{ids:string[]}){return <span className="guide-evidence">{ids.map(id=><SourceLink key={id} id={id}/>)}</span>}
export function DiagramBox({x,y,w,h,title,detail,color='#a8d871'}:{x:number;y:number;w:number;h:number;title:string;detail?:string;color?:string}){return <g><rect x={x} y={y} width={w} height={h} rx={8} fill="#18221b" stroke={color} strokeOpacity=".7"/><text x={x+w/2} y={y+(detail?h/2-3:h/2+5)} textAnchor="middle" fill={color} fontSize={15} fontWeight="600">{title}</text>{detail&&<text x={x+w/2} y={y+h/2+19} textAnchor="middle" fill="#a8b4a0" fontSize={12}>{detail}</text>}</g>}
export function Arrow({d,color,active=true,dashed=false}:{d:string;color:string;active?:boolean;dashed?:boolean}){return <path d={d} stroke={color} strokeWidth={active?3:1.6} fill="none" opacity={active?1:.2} strokeDasharray={dashed?'7 5':undefined} markerEnd={`url(#arrow-${color.slice(1)})`}/>}
export function Markers(){return <defs>{['#abe277','#66aeef','#47d1be','#c7a1ee','#ef8b9a'].map(color=><marker id={`arrow-${color.slice(1)}`} key={color} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={color}/></marker>)}</defs>}
export function StepFlow({steps}:{steps:GuideFact[]}){
 const [active,setActive]=useState(0);const step=steps[Math.min(active,steps.length-1)];useEffect(()=>setActive(0),[steps]);
 return <div className="guide-step-flow"><div className="guide-step-list">{steps.map((item,i)=><button key={item.title} className={active===i?'active':''} onClick={()=>setActive(i)}><b>{String(i+1).padStart(2,'0')}</b><span>{item.title}</span><ChevronRight size={15}/></button>)}</div><article><span className="eyebrow">STEP {String(active+1).padStart(2,'0')} · 工程解释</span><h3>{step.title}</h3><p>{step.text}</p><Evidence ids={step.sources}/>{step.note&&<p className="guide-note">{step.note}</p>}<button className="guide-next" onClick={()=>setActive((active+1)%steps.length)}>下一步 <ChevronRight size={14}/></button></article></div>;
}
export function Relationships(){return <div className="table-scroll"><table className="guide-relations"><thead><tr><th>机制</th><th>保护 / 管理对象</th><th>职责</th><th>边界</th></tr></thead><tbody>{securityRelations.map(item=><tr key={item.name}><td><strong>{item.name}</strong><Evidence ids={item.sources}/></td><td>{item.scope}</td><td>{item.description}</td><td>{item.limit}</td></tr>)}</tbody></table></div>}
export function TrustLanes(){return <div className="trust-lanes">{[
 {label:'基础设施管理',color:'#abe277',steps:['DPU 启动与固件','DOCA / Astra 控制','SuperNIC 管理锁定','硬件策略执行'],source:['SEC01','SEC02']},
 {label:'租户机密执行',color:'#c7a1ee',steps:['CPU / guest 证明','Realm 工作负载','GPU 设备验证','受保护 C2C / NVLink'],source:['SEC10','SEC11','SEC12']},
 {label:'可信设备 I/O',color:'#80b7ed',steps:['SPDM 身份 / 测量','TDISP 接口授权','IDE 通路就绪','允许机密 DMA'],source:['SEC17','SEC18','SEC20']},
 ].map(lane=><div key={lane.label} className="trust-lane" style={{'--lane-color':lane.color} as React.CSSProperties}><strong>{lane.label}</strong><div>{lane.steps.map((step,i)=><span key={step}>{i>0&&<ChevronRight size={13}/>}<b>{step}</b></span>)}</div><Evidence ids={lane.source}/></div>)}<p className="guide-note">按职责划分的验证层次；不是公开的固定启动报文时序。各保护域分别验证，再由工作负载策略组合。BMC → HMC → DPU 属管理关联。</p></div>}
