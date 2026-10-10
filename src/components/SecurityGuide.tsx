import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { useExplorer } from '../stores/useExplorer';
import { Evidence, DiagramBox, Arrow, Markers, StepFlow, Relationships, TrustLanes } from './GuideVisuals';
import { OfficialImage } from './HardwarePhoto';
import { getComponentPhotos } from '../data/photos';
import HardwareGuide from './HardwareGuide';
import InfrastructureGuide from './InfrastructureGuide';
import PlatformGuide from './PlatformGuide';
import NvlinkSecurityGuide from './NvlinkSecurityGuide';
import SentryGuide from './SentryGuide';
import { astraSteps, confidentialPaths, confidentialSteps, securityRelations, type GuideFact } from '../data/security-guides';

type Topic='rack'|'tray'|'fabric'|'network'|'astra'|'confidential'|'scalein'|'sentry'|'oasp'|'tor'|'c2c'|'platform'|'linkcrypto';
const topicInfo:Record<Topic,{title:string;label:string;sections:string[]}>= {
 platform:{title:'Vera Rubin六芯片平台全景',label:'平台全景',sections:['协同设计理念','六种芯片','从芯片到机柜','软件与工作负载','能效、RAS与安全']},
 tor:{title:'Top-of-Rack Ethernet Switches',label:'管理ToR',sections:['角色与拓扑','连接对象','管理与信任','原图与边界']},
 c2c:{title:'NVLink-C2C一致性与保护',label:'NVLink-C2C',sections:['一致性互联','数据如何流动','带宽与安全','原图与边界']},
 linkcrypto:{title:'NVLink 6链路加密与认证边界',label:'NVLink加密',sections:['公开证据','认证加密原理','交互验证','端点、密钥与SHARP']},
 rack:{title:'整柜概览图文详解',label:'整柜',sections:['结构总览','部件与规格','连接与数据流','官方原图与边界']},
 tray:{title:'计算托盘图文详解',label:'计算托盘',sections:['结构总览','部件与规格','连接与数据流','官方原图与边界']},
 fabric:{title:'NVLink交换网络图文详解',label:'NVLink',sections:['交换结构','部件与规格','Scale-Up数据交换','官方原图与边界']},
 network:{title:'三级网络图文详解',label:'三级网络',sections:['网络职责','部件与规格','数据与控制流','官方原图与边界']},
 astra:{title:'BlueField Astra图文详解',label:'Astra',sections:['理念与架构','策略如何执行','信任链中的位置','边界与原始图']},
 confidential:{title:'机密计算图文详解',label:'机密计算',sections:['保护域与威胁边界','数据路径与密钥','证明与安全使能','关系与待核实']},
 scalein:{title:'Scale-In基础设施图文详解',label:'Scale-In',sections:['基础设施架构','数据与控制','DOCA服务','部署与边界']},
 sentry:{title:'Sentry：架构、证据与执行边界',label:'Sentry',sections:['定位与证据','双域架构','请求与策略','身份与遥测','形式化验证','模型路径','验收与边界','源码与关系']},
 oasp:{title:'NVIDIA Open Agent Safety Platform',label:'Open Agent Safety',sections:['三层参考体系','OpenShell组件','Sentry硬件执行','部署与边界']},
};
function AstraDiagram(){
 const [flow,setFlow]=useState('control');
 const explanations={control:'绿色路径：管理侧 → DPU 带外入口 → BlueField-4 / DOCA → 专用连接 → 8 个 ConnectX-9 的硬件策略。',data:'蓝色路径：租户工作负载经设备 I/O 使用 ConnectX-9 数据面进入机架外计算网络。图中数据没有被强制绕行 DPU 的外部端口。',storage:'青色路径：BlueField-4 承载南北向基础设施服务，可连接存储和前端网络；Scale-In 的范围不只机柜内部。'};
 return <div className="guide-diagram"><div className="diagram-select">{[['control','Astra 控制面'],['data','租户计算数据面'],['storage','南北向服务']].map(([id,label])=><button key={id} onClick={()=>setFlow(id)} className={flow===id?'active':''}>{label}</button>)}</div>
 <svg viewBox="0 0 960 480" role="img" aria-label="Astra控制面与租户数据面分离的逻辑架构图"><Markers/>
  <rect x="20" y="105" width="260" height="303" rx="12" fill="#21202c" stroke="#a994c0" strokeDasharray="6 5"/><text x="40" y="137" fill="#c7afd8" fontSize="16">租户执行域</text><text x="40" y="159" fill="#9d94aa" fontSize="12">OS / 工作负载 · 可使用数据面</text>
  <DiagramBox x={40} y={184} w={102} h={55} title="Vera CPU 1" color="#c7a1ee"/><DiagramBox x={156} y={184} w={102} h={55} title="Vera CPU 2" color="#c7a1ee"/>
  {[0,1,2,3].map(i=><DiagramBox key={i} x={40+i*55} y={269} w={48} h={59} title={`GPU ${i+1}`} color="#b4d781"/>)}
  <text x="150" y="372" textAnchor="middle" fill="#b5a5c1" fontSize="12">不掌握 SuperNIC 管理接口</text>
  <rect x="321" y="92" width="610" height="126" rx="12" fill="#172618" stroke="#6f9b4f" strokeDasharray="6 5"/><text x="337" y="114" fill="#9bbb81" fontSize="12">基础设施控制域 · 与租户主机分离</text>
  <DiagramBox x={465} y={10} w={245} h={57} title="服务提供方 / 管理侧" detail="配置与策略从 DPU 带外入口进入"/>
  <DiagramBox x={465} y={130} w={245} h={68} title="BlueField-4 · Astra" detail="DOCA 服务与可信管理控制点"/>
  <DiagramBox x={754} y={136} w={162} h={58} title="N–S / 存储服务" detail="基础设施卸载与接入" color="#47d1be"/>
  <Arrow d="M588 67 V129" color="#abe277" active={flow==='control'}/><Arrow d="M710 164 H752" color="#47d1be" active={flow==='storage'}/>
  <path d="M588 198 V236 H352 M588 236 H838" stroke="#abe277" fill="none" strokeWidth="2" opacity={flow==='control'?1:.2}/>
  <text x="336" y="257" fill="#8ba477" fontSize="11">四端点板组 A</text><text x="615" y="257" fill="#8ba477" fontSize="11">四端点板组 B</text>
  {[0,1,2,3,4,5,6,7].map(i=>{const x=330+i*62+(i>=4?26:0);return <g key={i}><Arrow d={`M${x+27} 236 V267`} color="#abe277" active={flow==='control'}/><DiagramBox x={x} y={270} w={54} h={58} title={`CX9 ${i+1}`} color="#66aeef"/><Arrow d={`M${x+27} 329 V359`} color="#66aeef" active={flow==='data'}/></g>})}
  <Arrow d="M280 213 H307 V299 H329" color="#66aeef" active={flow==='data'}/><text x="480" y="474" textAnchor="middle" fill="#8ca2b7" fontSize="11">工作负载经设备 I/O 使用网络端点；逻辑关联，不是 PCIe 布线图</text>
  <path d="M357 360 H817" stroke="#66aeef" fill="none" strokeWidth="2" opacity={flow==='data'?1:.2}/><Arrow d="M701 360 V389" color="#66aeef" active={flow==='data'}/>
  <DiagramBox x={580} y={391} w={245} h={59} title="E–W / Scale-Out fabric" detail="Spectrum-X 或 Quantum-X800" color="#66aeef"/>
 </svg><p className="diagram-explanation">{explanations[flow as keyof typeof explanations]} <Evidence ids={flow==='storage'?['SEC03']:['SEC01','SEC02','HW90']}/></p></div>;
}
function ConfidentialDiagram({path}:{path:number}){return <svg className="confidential-diagram" viewBox="0 0 960 430" role="img" aria-label="CPU Realm、GPU TEE、受保护互联、可信设备I/O与外部存储边界"><Markers/>
 <rect x="25" y="55" width="910" height="235" rx="15" fill="#24202e" stroke="#b297d1" strokeDasharray="7 5"/><text x="45" y="85" fill="#ceafea" fontSize="16">工作负载保护域 · 可信端点与受保护互联</text>
 <DiagramBox x={50} y={122} w={240} h={109} title="Vera · Realm VM" detail="LPDDR5X / 每 VM 独立密钥" color={path===0?'#c7a1ee':'#ac95c0'}/>
 <DiagramBox x={510} y={120} w={167} h={113} title="Rubin GPU TEE" detail="HBM / 计算上下文" color="#abe277"/><DiagramBox x={754} y={120} w={157} h={113} title="Rubin GPU TEE" detail="独立设备验证" color="#abe277"/>
 <Arrow d="M291 176 H508" color="#ef8b9a" active={path===1}/><text x="402" y="149" textAnchor="middle" fill="#d597a4" fontSize="12">NVLink-C2C</text><text x="402" y="200" textAnchor="middle" fill="#bd9caa" fontSize="10">authenticated encryption</text>
 <Arrow d="M678 176 H752" color="#ef8b9a" active={path===2}/><text x="716" y="146" textAnchor="middle" fill="#d597a4" fontSize="11">NVLink 6</text>
 <text x="714" y="263" textAnchor="middle" fill="#b8a2c3" fontSize="11">交换 fabric 的密钥角色 / 加密终止位置未披露</text>
 <DiagramBox x={345} y={328} w={248} h={74} title="可信设备接口 / NIC / DPU" detail="设备与固件仍需验证和隔离" color="#c7a1ee"/>
 <Arrow d="M170 232 V365 H343" color="#c7a1ee" active={path===3}/><text x="53" y="323" fill="#b9a0d1" fontSize="12">SPDM + TDISP + PCIe IDE</text>
 <DiagramBox x={730} y={328} w={205} h={74} title="外部网络 / 持久存储" detail="传输保护 + 独立落盘密钥" color="#66aeef"/>
 <Arrow d="M595 364 H727" color="#66aeef" active={path===4||path===5}/><text x="662" y="344" textAnchor="middle" fill="#8cb3d3" fontSize="11">独立网络保护</text>
 <text x="27" y="26" fill="#8d9b87" fontSize="12">概念图：平台能力不等于已使能状态；本图不代表共享一把全柜密钥</text>
 </svg>}
export default function SecurityGuide(){
 const topic=useExplorer(s=>s.securityGuide) as Topic,update=useExplorer(s=>s.update);
 const [section,setSection]=useState(0),[path,setPath]=useState(0);const body=useRef<HTMLDivElement>(null);
 const astra=topic==='astra',hardware=['rack','tray','fabric','network'].includes(topic),infrastructure=['scalein','oasp'].includes(topic);
 const info=topicInfo[topic];
 const platformTopic=['tor','c2c','platform'].includes(topic);
 useEffect(()=>{setSection(0);setPath(0)},[topic]);
 useEffect(()=>{body.current?.scrollTo({top:0})},[section,topic]);
 useEffect(()=>{const original=document.activeElement as HTMLElement;document.getElementById('close-security-guide')?.focus();const listener=(event:KeyboardEvent)=>{if(event.key==='Escape')update({securityGuide:null})};document.addEventListener('keydown',listener);return()=>{document.removeEventListener('keydown',listener);original?.focus()}},[update]);
 const sections=info.sections;
 const official=getComponentPhotos(astra?'astra':'realm')[0];
 return <div className="modal-backdrop" onClick={()=>update({securityGuide:null})}><section className="security-guide" role="dialog" aria-modal="true" aria-labelledby="security-guide-title" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Tab'){const nodes=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button,a,input,select'));const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}}>
 <header><div><span className="eyebrow"><ShieldCheck size={14}/> ARCHITECTURE GUIDE / VERA RUBIN NVL72</span><h2 id="security-guide-title">{info.title}</h2></div><button id="close-security-guide" className="icon-button" aria-label="关闭安全专题" onClick={()=>update({securityGuide:null})}><X size={22}/></button></header>
 <div className="security-guide-topics">{Object.entries(topicInfo).map(([id,item])=><button key={id} className={topic===id?'active':''} onClick={()=>update({securityGuide:id as Topic})}>{item.label}</button>)}</div>
 <div className="security-guide-tabs">{sections.map((title,i)=><button key={title} className={section===i?'active':''} onClick={()=>setSection(i)}><span>0{i+1}</span>{title}</button>)}</div>
 <div ref={body} className="security-guide-body">
 {topic==='sentry'?<SentryGuide section={section}/>:topic==='linkcrypto'?<NvlinkSecurityGuide section={section}/>:platformTopic?<PlatformGuide topic={topic as 'tor'|'c2c'|'platform'} section={section}/>:hardware?<HardwareGuide topic={topic as 'rack'|'tray'|'fabric'|'network'} section={section}/>:infrastructure?<InfrastructureGuide topic={topic as 'scalein'|'oasp'} section={section}/>:astra? <>
  {section===0&&<><div className="guide-intro"><span className="eyebrow">ADVANCED SECURE TRUSTED RESOURCE ARCHITECTURE</span><h3>基础设施控制权位于租户主机之外</h3><p>Astra 是 Vera Rubin NVL72 中以 BlueField-4 为中心的基础设施架构。它规定 DPU、SuperNIC、租户主机和管理入口之间的控制权边界，让服务提供方在独立的 DPU 域配置和监控网络策略。<Evidence ids={['SEC01','SEC02']}/></p></div><div className="guide-key-facts"><div><strong>1</strong><span>BlueField-4 / 托盘</span></div><div><strong>8</strong><span>ConnectX-9 端点 / 托盘</span></div><div><strong>2 × 4</strong><span>SuperNIC 板组组织</span></div><Evidence ids={['HW04','HW06','HW90']}/></div><AstraDiagram/><div className="guide-two-column"><article><h3>租户拥有计算数据面的使用权</h3><p>CPU/GPU 工作负载使用网络端点执行通信；NIC 管理接口和基础设施策略保持在 DPU 控制域。裸金属主机的管理权限不应扩展为 SuperNIC 管理权限。</p><Evidence ids={['SEC01','SEC02']}/></article><article><h3>一个管理点覆盖两类网络职责</h3><p>BlueField 的南北向接入、存储与基础设施服务，通过 Astra 延伸到东西向 AI 计算网络的管理。网络数据范围与管理权归属是两个不同维度。</p><Evidence ids={['SEC01','SEC03']}/></article></div></>}
  {section===1&&<><div className="guide-intro"><h3>一条租户网络策略如何到达硬件</h3><p>下面以策略配置为例讲解职责分工。步骤用于理解架构，不执行真实管理操作，也不声称 NVIDIA 已公布完整 Astra 消息协议。</p></div><StepFlow steps={astraSteps}/><AstraDiagram/><h3 className="guide-section-title">BlueField-4 上的 DOCA 服务</h3><div className="doca-services">{[['HBN','南北向网络','租户感知的网络配置、隔离与策略'],['加速 OVS','东西向网络','将软件定义网络策略延伸到计算 fabric'],['Argus','运行时观察','从 DPU 域采集可见运行状态并产生告警'],['SNAP','存储卸载','在 DPU 上组织虚拟化存储 I/O'],['DMS','设备生命周期','发现、配置、管理与供应设备']].map(([name,role,description])=><article key={name}><strong>{name}</strong><span>{role}</span><p>{description}</p></article>)}</div><Evidence ids={['SEC01','SEC04']}/></>}
  {section===2&&<><div className="guide-intro"><h3>Astra 是基础设施信任边界中的一层</h3><p>DPU 管理隔离、Realm 机密执行、GPU 设备保护与 I/O 安全要分别成立。图中箭头是工程验证依赖，不能用 Astra 的存在代替 CPU/GPU 证明或租户密钥释放。</p><Evidence ids={['SEC01','SEC10','SEC11','SEC18']}/></div><TrustLanes/><Relationships/></>}
  {section===3&&<><div className="guide-intro"><h3>已确认的控制权，不等于已披露全部密码实现</h3><p>专用连接、DPU 管理和 SuperNIC 锁定有公开证据。以下事项仍须由厂商版本资料与实际配置确认。</p></div><div className="guide-unknowns">{['Astra 专用控制链路采用何种承载和密码协议。','数据密钥由谁生成、如何协商、轮换及撤销。','设备故障、DPU失陷、重置和升级时的策略与凭证恢复。','Argus 对 Realm 私有内存的授权与可见性；不能默认穿透隔离。','Sentry 在指定 agent 路径中的不可绕过性；不能外推为全柜流量都被语义检查。'].map(text=><p key={text}><span>待核实</span>{text}</p>)}</div><Evidence ids={['SEC01','SEC02','SEC04','SEC07','SEC12','HW90']}/><h3 className="guide-section-title">NVIDIA 官方 Astra 架构原图</h3><figure className="guide-official"><OfficialImage asset={official} eager/><figcaption>© NVIDIA Corporation · Figure 1 · <a href={official.sourcePage} target="_blank" rel="noreferrer">打开官方文章 <ArrowUpRight size={12}/></a></figcaption></figure></>}
 </>:<>
  {section===0&&<><div className="guide-intro"><h3>保护的是工作负载及其跨设备的数据通路</h3><p>Vera Rubin 将 CPU、GPU 和互联的保护扩展到机架规模。Realm 负责 CPU 侧隔离，GPU 具有自己的受保护执行域，数据跨 C2C、NVLink、PCIe 和外部网络时需要分别判断信任与加密边界。<Evidence ids={['SEC10','SEC11','SEC12']}/></p></div><ConfidentialDiagram path={0}/><div className="guide-three-column"><article><span>01 / 平台能力</span><h3>硬件和协议支持什么</h3><p>例如 Arm CCA、GPU TEE、受保护互联、TDISP 与 IDE。能力声明保留适用版本与未披露细节。</p><Evidence ids={['SEC10','SEC11']}/></article><article><span>02 / 部署配置</span><h3>当前系统启用了什么</h3><p>固件、设备分配、接口状态、IDE stream 和外部网络保护必须匹配；型号本身不是使能证据。</p><Evidence ids={['SEC18','SEC20']}/></article><article><span>03 / 租户验证</span><h3>证据是否满足策略</h3><p>分别验证身份、测量与成员授权，再决定工作负载准入及密钥释放。这是工程验收要求。</p><Evidence ids={['SEC10','SEC11','SEC17']}/></article></div><div className="guide-note">保护边界不能代替应用自身安全，也不自动提供可用性保证。公开资料尚未给出 Vera/Rubin 全部侧信道、物理攻击及恢复场景的独立细粒度威胁模型。<Evidence ids={['HW90']}/></div></>}
  {section===1&&<><div className="guide-intro"><h3>沿着数据路径检查每一段保护</h3><p>点击通路，查看保护端点、密钥域与证据。源端和目的端在受保护执行范围内仍需使用可计算的数据，链路加密的终止位置需要明确。</p></div><div className="diagram-select">{confidentialPaths.map((item,i)=><button key={item.title} className={path===i?'active':''} onClick={()=>setPath(i)}>{item.title}</button>)}</div><ConfidentialDiagram path={path}/><article className="path-explanation"><h3>{confidentialPaths[path].title}</h3><p>{confidentialPaths[path].text}</p><Evidence ids={confidentialPaths[path].sources}/><p className="guide-note">{confidentialPaths[path].note}</p></article><p className="guide-note">密钥域分别包括 Realm 内存、C2C、GPU/NVLink、SPDM 会话、PCIe IDE、外部网络与存储业务密钥。不能把 SPDM 控制会话密钥直接等同于 IDE 或 NVLink 的数据密钥。<Evidence ids={['HW90','SEC17','SEC18']}/></p></>}
  {section===2&&<><div className="guide-intro"><h3>从“支持机密计算”到“可验证的租户环境”</h3><p>以下为工程验收流程，不是实际证明结果或完整的 NVIDIA 部署命令。任何一步的版本、身份、授权和状态都需要可验证证据。</p></div><StepFlow steps={confidentialSteps}/><TrustLanes/><div className="guide-two-column"><article><h3>SPDM：建立设备信任</h3><p>协商能力与算法，验证设备身份、获取测量并建立安全控制会话。PCIe枚举成功不等于完成认证。</p><Evidence ids={['SEC17']}/></article><article><h3>TDISP + IDE：接口与通路同时就绪</h3><p>TDISP限制目标设备接口的归属和状态，IDE保护实际TLP。两者满足安全前提后才能开放机密DMA；还须验证终止端的固件与缓冲区边界。</p><Evidence ids={['SEC18','SEC20']}/></article></div></>}
  {section===3&&<><div className="guide-intro"><h3>机密执行、基础设施控制和运行时治理分别评估</h3><p>Astra、Argus、Sentry和IMEX与工作负载保护相邻，但分别处理不同问题。不要把一层能力当成另一层的证明。</p></div><Relationships/><h3 className="guide-section-title">公开资料尚未解决的问题</h3><div className="guide-unknowns">{['NVLink 加密是端到端还是逐跳，交换 ASIC 的密钥与明文角色。','Vera 每 VM 密钥的具体生成、销毁、迁移与轮换机制。','Rubin GPU 的完整证明接口、CC模式配置及HBM/上下文保护粒度。','机架级成员加入、撤销、恢复与租户密钥释放的实际集成。','IMEX 在 Vera Rubin 上的正式产品绑定与机密计算协同。','Astra 专用控制通路的密码协议；Argus 对 Realm 私有页的可见性。'].map(text=><p key={text}><span>待核实</span>{text}</p>)}</div><Evidence ids={['SEC10','SEC11','SEC13','SEC01','SEC04','HW90']}/><h3 className="guide-section-title">官方机架级机密计算示意</h3><figure className="guide-official"><OfficialImage asset={official} eager/><figcaption>© NVIDIA Corporation · <a href={official.sourcePage} target="_blank" rel="noreferrer">打开官方来源 <ArrowUpRight size={12}/></a></figcaption></figure></>}
 </>}
 </div><footer>图示均为架构解释；没有执行真实证明、DMA、密钥释放或设备配置。<span>资料核验：2026.10.10</span></footer>
 </section></div>;
}
