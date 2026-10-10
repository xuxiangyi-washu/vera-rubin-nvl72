import { useState } from 'react';
import { Evidence, DiagramBox, Arrow, Markers, Relationships } from './GuideVisuals';
import { OfficialImage } from './HardwarePhoto';
import { getComponentPhotos } from '../data/photos';
import { evaluatePolicyDemo, type PolicyMode, type PolicyScenario } from '../utils/policy-demo.mjs';

const revision='e1f3c82caa3ed3b65de22889ae7ef32a774878ef';
const verdicts=[
 ['已公开定位','Sentry是BlueField-4 + DOCA带外watchdog参考系统；可与OpenShell组合。','SEC06'],
 ['可核对的软件','OpenShell v0.1.3的隔离、网络策略、凭证与prover文档和源码。','SEC23'],
 ['尚待厂商确认','Sentry具体SDK/API、身份协议、遥测签名格式、密钥与故障状态机。','SEC07'],
];
function Intro({title,children,ids=[]}:{title:string;children:React.ReactNode;ids?:string[]}){return <div className="guide-intro"><h3>{title}</h3><p>{children}</p><Evidence ids={ids}/></div>}
function Matrix({headers,rows}:{headers:string[];rows:string[][]}){return <div className="table-scroll"><table className="guide-relations"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
function SentryArchitecture(){
 const [hardware,setHardware]=useState(true);
 return <div className="sentry-architecture"><div className="diagram-select"><button className={!hardware?'active':''} onClick={()=>setHardware(false)}>OpenShell 软件边界</button><button className={hardware?'active':''} onClick={()=>setHardware(true)}>叠加 Sentry 硬件域</button></div>
 <svg className="hardware-diagram" viewBox="0 0 960 500" role="img" aria-label="OpenShell软件边界与可选Sentry独立硬件域，逻辑职责示意"><Markers/>
 <DiagramBox x={310} y={18} w={248} h={66} title="Gateway / 运营者" detail="策略、身份、生命周期" color="#c7a1ee"/>
 <Arrow d="M434 85 V165" color="#c7a1ee"/>
 <rect x={16} y={155} width={239} height={188} rx={10} fill="#252031" stroke="#aa89c5" strokeDasharray="7 5"/>
 <text x={135} y={184} textAnchor="middle" fill="#d8bde9" fontSize={15}>不可信工作负载域</text>
 <DiagramBox x={35} y={205} w={201} h={79} title="Agent + Sandbox" detail="文件、进程、网络约束" color="#c7a1ee"/>
 <text x={135} y={319} textAnchor="middle" fill="#aa9cb8" fontSize={12}>外层网络隔离限制直接出口</text>
 <DiagramBox x={312} y={166} w={244} h={164} title="OpenShell Supervisor" detail="可信策略判定 / 凭证代理" color="#66aeef"/>
 <Arrow d="M256 242 H310" color="#66aeef"/>
 <text x={285} y={364} textAnchor="middle" fill="#a3b5c6" fontSize={12}>认证的 Sandbox Protocol</text>
 <g opacity={hardware?1:.25}><rect x={610} y={155} width={329} height={188} rx={10} fill="#1b2b1b" stroke="#abe277" strokeDasharray="7 5"/><text x={774} y={184} textAnchor="middle" fill="#bade9a" fontSize={15}>主机之外的独立硬件域 · 可选</text><DiagramBox x={631} y={208} w={287} h={86} title="BlueField-4 / DOCA / Sentry" detail="观察、身份治理、策略执行"/><Arrow d="M558 242 H608" color="#abe277" active={hardware}/></g>
 <DiagramBox x={617} y={399} w={313} h={64} title="模型 / 工具 / 数据服务" detail="覆盖哪些路径，按部署验证" color="#66aeef"/>
 {hardware?<Arrow d="M774 344 V397" color="#abe277"/>:<Arrow d="M434 331 V431 H615" color="#66aeef"/>}
 <text x={25} y={431} fill="#b4bbac" fontSize={13}>{hardware?'参考设计：DPU处于节点通往模型的必要路径':'OpenShell在受支持环境中不依赖BlueField-4'}</text>
 <text x={480} y={490} textAnchor="middle" fill="#9aab91" fontSize={12}>逻辑职责图；不声称Supervisor必定部署在DPU，亦不指定Sentry内部协议。</text>
 </svg><p className="guide-note">软件“进程外执行”与硬件“主机外信任域”是两种不同边界。图中带外指控制不受agent/主机支配，不等于只复制一份旁路流量。<Evidence ids={['SEC07','SEC08','SEC24']}/></p></div>;
}
function RequestLab(){
 const [scenario,setScenario]=useState<PolicyScenario>('read'),[mode,setMode]=useState<PolicyMode>('enforce');
 const result=evaluatePolicyDemo({scenario,mode});
 const requests={read:'GET model.example.com/v1/models',write:'DELETE model.example.com/v1/models/demo',network:'GET other.example.com/v1/models',credential:'GET model.example.com/admin/export'};
 const explanations={network:'host不在连接允许范围，先拒绝；audit不改变连接授权。',credential:'网络和读请求规则允许，但凭证绑定只覆盖/v1/，拒绝向/admin/发送该凭证。',request:'DELETE违反只读规则；enforce模式在转发前阻断。',complete:result.result==='audit-only'?'audit只记录这次L7规则违规，教学请求仍被转发。':'连接、请求规则和凭证目标三项均满足，教学请求被转发。'};
 return <div className="sentry-lab"><p className="guide-note"><strong>教学规则演算</strong>：本页没有运行OpenShell、SMT或Sentry，也不会发出网络请求、释放凭证或隔离真实agent。以下展示软件策略语义，不冒充DPU测量结果。</p>
 <div className="diagram-select">{([['read','允许的读取'],['write','越权写入'],['network','未授权目的地'],['credential','凭证目标不匹配']] as [PolicyScenario,string][]).map(([id,name])=><button key={id} className={scenario===id?'active':''} onClick={()=>setScenario(id)}>{name}</button>)}</div>
 <label className="sentry-mode">L7处理模式 <select aria-label="L7处理模式" value={mode} onChange={e=>setMode(e.target.value as PolicyMode)}><option value="enforce">enforce · 阻断违规</option><option value="audit">audit · 记录并转发</option></select></label>
 <div className="sentry-request"><span>示例请求 · /usr/bin/python3</span><code>{requests[scenario]}</code></div>
 <div className="sentry-gates">{[['network','① 连接授权','仅 model.example.com:443'],['request','② 请求规则','只读 GET / HEAD / OPTIONS'],['credential','③ 凭证绑定','仅 model.example.com:443/v1/']].map(([gate,title,detail])=><article key={gate} className={result.gate===gate?'blocked':''}><strong>{title}</strong><p>{detail}</p></article>)}</div>
 <div className={`sentry-result ${result.result}`} role="status"><strong>{result.result==='blocked'?'教学结果：拒绝转发':result.result==='audit-only'?'教学结果：记录违规，仍然转发':'教学结果：允许转发'}</strong><p>{explanations[result.gate]}</p><small>凭证替换条件：{result.credentialReleased?'满足（示例，不存在真实凭证）':'不满足或请求已被阻断'}</small></div>
 <Evidence ids={['SEC26','SEC27']}/><p>本页为便于观察阻断而初始选择enforce；OpenShell v0.1.3该L7字段的默认值是audit。真实阻断状态必须核对有效配置。</p><p>上图按独立条件解释决策，不声明内部函数的固定调用顺序。Sentry如何将同一业务策略编译到DOCA及硬件规则，公开资料尚无完整接口契约。</p></div>;
}
const sourceRows=[
 ['架构和认证','SEC24','docs/about/architecture.mdx','Supervisor位置、Sandbox Protocol、sandbox/generation凭证'],
 ['网络规则','SEC26','docs/how-it-works/policies/network-rules.mdx','连接规则与L7规则，audit/enforce分开'],
 ['凭证代理','SEC27','docs/how-it-works/providers/overview.mdx','双重授权、占位符、失败关闭'],
 ['策略证明','SEC25','docs/how-it-works/policies/prover.mdx','覆盖范围、反例及unsupported/inconclusive'],
 ['审计导出','SEC28','docs/observability/ocsf-json-export.mdx','OCSF字段、best-effort及队列丢失边界'],
 ['Docker隔离','SEC30','crates/openshell-driver-docker/src/isolation.rs','network_mode=none与外层隔离校验'],
 ['进程冻结','SEC31','crates/openshell-sandbox/src/boundary_io.rs','freeze/SIGSTOP是OpenShell实现，不是Sentry硬件命令'],
];
export default function SentryGuide({section}:{section:number}){return <div className="sentry-guide">
 {section===0&&<><Intro title="NVIDIA Sentry：独立硬件域中的 agent 治理" ids={['SEC06','SEC08']}>官方在2026-09-28发布的Open Agent Safety Platform中，将Sentry定位为BlueField-4上基于DOCA的带外watchdog参考系统。它扩展观察与策略执行能力；OpenShell提供可独立部署的软件运行时。</Intro><div className="sentry-evidence-cards">{verdicts.map(([label,text,id])=><article key={label}><span>{label}</span><p>{text}</p><Evidence ids={[id]}/></article>)}</div><SentryArchitecture/><h3 className="guide-section-title">从宣传词到可检验的问题</h3><Matrix headers={['公开描述','应当怎样解读','仍需什么证据']} rows={[
 ['每个请求与响应','指被治理的路径与访问范围','解密点、事件丢失、协议覆盖与旁路验证'],['可验证agent身份','身份与委派权限参与持续治理','Sentry身份格式、签发者、轮换与撤销接口'],['attested telemetry','官方提出可证明遥测能力','签名主体、证书链、新鲜度与验证者流程'],['毫秒级隔离','厂商响应能力声明','起止时间、负载、分位数和副作用停止证据'],
 ]}/><Evidence ids={['SEC06','SEC07','SEC08']}/><p className="guide-note">“公开资料确认”不表示已完成实机验证。Sentry也不同于GPU故障治理系统NVSentinel，以及gVisor中同名的Sentry组件。<Evidence ids={['SEC21','SEC35']}/></p></>}
 {section===1&&<><Intro title="三类流动、两种信任边界" ids={['SEC07','SEC24']}>控制流负责策略与身份；业务数据流承载模型、工具和数据访问；证据流供审计和干预。三者逻辑分开，不推导出未经公开的物理端口或密码协议。</Intro><SentryArchitecture/><Matrix headers={['组件','职责','信任前提']} rows={[
 ['Gateway','身份、策略、provider与沙箱生命周期','运营者、网关凭证和管理入口需要保护'],['Sandbox','拥有agent进程、识别调用程序、转送TCP/DNS','位于不可信工作负载一侧；不能决定放行策略'],['Supervisor','在可信侧检查访问、供应凭证、建立上游连接','进程外并不自动意味着主机内核也不受信任'],['BlueField-4 / Sentry','参考设计中的独立观察与硬件策略执行','固件、管理权限、实际必要路径须核验'],
 ]}/><Evidence ids={['SEC24','SEC07']}/><h3 className="guide-section-title">OpenShell具体运行时如何建立出口约束</h3><Matrix headers={['运行时','Supervisor位置 / 传输','外层出口约束']} rows={[
 ['Docker / Podman','独立容器 / 认证Unix socket','工作负载关闭直接网络'],['Kubernetes','独立Pod / mTLS TCP','CNI必须落实只允许Supervisor的NetworkPolicy'],['VM','宿主进程 / 认证vsock','guest不配置直接网络设备'],
 ]}/><Evidence ids={['SEC24','SEC30','SEC32']}/><p className="guide-note">这张表描述OpenShell v0.1.3软件架构；不能据此认定Supervisor运行在Sentry DPU中，也不能把旧的veth代理概括套用到所有运行时。</p></>}
 {section===2&&<><Intro title="一次工具请求，为什么要经过多个独立条件" ids={['SEC26','SEC27']}>连接到了获准主机，仍不等于可以调用任意API或携带任意凭证。切换下面的场景和处理模式，观察每种授权边界的作用。</Intro><RequestLab/><div className="guide-two-column"><article><h3>模型调用也是一条受治理的访问</h3><p>模型provider需要有效的网络与凭证绑定；OpenShell控制访问和执行。Sentry参考设计进一步控制模型路径，但不取代推理框架和NCCL。</p><Evidence ids={['SEC07','SEC27']}/></article><article><h3>TLS内容检查有明确终止点</h3><p>OpenShell代理的TLS终止支持L7检查和占位凭证替换；tls:skip和不透明隧道不提供相同内容可见性。这不能证明Sentry采用同样的解密部署。</p><Evidence ids={['SEC27','SEC33']}/></article></div></>}
 {section===3&&<><Intro title="身份、凭证和可证明遥测是三个问题" ids={['SEC06','SEC24']}>Sentry公开能力包含身份治理、委派权限与attested telemetry。可以用OpenShell源码理解软件身份边界，但不能把它的JWT格式直接称作Sentry设备证明协议。</Intro><div className="guide-three-column"><article><span>谁在行动</span><h3>工作负载身份</h3><p>OpenShell凭证按sandbox和本轮generation绑定。Gateway JWT与Sandbox JWT用途分开；重启后刷新凭证。委派权限仍需与业务授权一致。</p><Evidence ids={['SEC24','SEC29']}/></article><article><span>能把秘密给谁</span><h3>端点绑定凭证</h3><p>被托管的API秘密由可信代理替换占位符；主机、端口和路径必须落在绑定内。自行放进工作区的秘密不受这一机制自动保护。</p><Evidence ids={['SEC27']}/></article><article><span>谁证明记录可信</span><h3>遥测证明</h3><p>需定义证据签发者、受信固件状态、新鲜度、请求关联和验证者。Sentry具体证书与签名格式在本次材料中未定位。</p><Evidence ids={['SEC06','SEC08']}/></article></div><h3 className="guide-section-title">结构化日志不等于完整、不可伪造的历史</h3><p>OpenShell的OCSF导出明确为best-effort。事件ID用于去重，sandbox ID用于关联；队列可能丢弃新日志，持久性依赖外部采集。OCSF字段的存在不证明Sentry遥测已经过远程证明。</p><Evidence ids={['SEC28']}/><Matrix headers={['验收维度（工程建议）','需要回答的问题']} rows={[
 ['来源真实性','谁签名？哪个固件、策略版本与执行点产生事件？'],['新鲜度与防重放','如何验证序列、会话、时间和丢失区间？'],['行为关联','如何将agent、子agent、工具、请求与执行结果连接起来？'],['隐私与覆盖','是否含prompt或秘密？谁可解密？哪些请求不可观察？'],['证据保留','队列满、采集故障和DPU重启后如何恢复可审计性？'],
 ]}/><p className="guide-note">上表是研究建议的验收问题，不是NVIDIA已公布的Sentry报文Schema。</p></>}
 {section===4&&<><Intro title="形式化验证到底证明了什么" ids={['SEC25','SEC29']}>OpenShell使用SMT检查已建模的策略属性。Boundary check与proposal risk check回答不同问题，通过其中一项不意味着另一项也通过，更不意味着任务意图或模型行为已被完整证明。</Intro><div className="sentry-formula"><strong>候选策略允许集合 ⊆ 边界策略允许集合</strong><span>仅对prover已建模的语义成立；不是“agent永远安全”的证明。</span></div><Matrix headers={['检查','输入与问题','不包含什么']} rows={[
 ['Boundary check','候选策略与最大允许边界；能否找到越界访问反例','不证明策略足够小、任务安全或运行时确已执行'],['Proposal risk check','新增网络规则相对当前策略增加了哪些风险','不自动完成企业最大边界检查'],['运行时执行','当前请求是否满足已生效规则','不从静态证明自动得到固件、主机和网络可信'],
 ]}/><Evidence ids={['SEC25','SEC29']}/><Matrix headers={['结果','含义','阅读方式']} rows={[
 ['within_boundary','已建模范围内未超出边界','还要核对coverage与实际生效策略'],['exceeds_boundary','找到反例','收紧候选策略或重新定义边界'],['unsupported','语义未覆盖','不能当成通过'],['inconclusive','超时或资源限制等导致无结论','不能当成通过'],['error','输入或执行错误','先修正检查条件'],
 ]}/><p>v0.1.3的boundary checker覆盖部分文件访问、进程身份、Landlock、L4 TCP和REST语义；GraphQL、MCP等运行时协议支持不能直接视为prover覆盖。策略来自全局、镜像、用户与provider组合，必须核对有效策略。</p><Evidence ids={['SEC25','SEC26','SEC34']}/><p className="guide-note">网页展示的是研究解释，没有在浏览器运行SMT求解器，也没有对真实agent签发“安全通过”结果。</p></>}
 {section===5&&<><Intro title="模型路径是控制点，但不是全部业务副作用" ids={['SEC07']}>官方指定Vera Rubin POD参考拓扑中，每个计算托盘的BlueField-4位于节点通往模型的必要路径。阻断这条路径可以约束后续模型交互；还要分析已经启动的工具、任务和其他出口。</Intro><SentryArchitecture/><Matrix headers={['场景','可以形成的控制','不能直接外推的结论']} rows={[
 ['经受控入口调用远端模型','按身份和策略限制后续请求','已提交的数据库写入、后台工具会自动撤销'],['本地GPU上运行模型','需要核实本地调用是否被同一机制覆盖','一定经过DPU外部网络端口'],['多agent与子agent','需要传播身份、委派范围与撤销关系','父agent有权限，子agent就能无限继承'],['NVLink / NCCL / IMEX','各自处理GPU通信与显存映射授权','Sentry理解全部NVLink载荷或替代IMEX'],['Realm / GPU TEE','执行域按授权保护租户秘密','DPU可以默认读取Realm私有页或HBM明文'],
 ]}/><Evidence ids={['SEC07','SEC10','SEC11','SEC13','SEC24']}/><p className="guide-note">关键洞察：带外描述控制权隔离；必要路径描述数据路径覆盖。两者都成立，仍须单独验证业务授权、内容可见性与撤销效果。</p></>}
 {section===6&&<><Intro title="把“毫秒级隔离”拆成可测事件" ids={['SEC06']}>官方公布毫秒级隔离能力，但本次资料没有给出可复现的负载、分位数、事件起止与完整测试方法。下方是工程验收框架，不是性能测量。</Intro><div className="sentry-timeline">{[['t0','异常动作发生'],['t1','产生观测证据'],['t2','完成策略判定'],['t3','执行点确认生效'],['t4','业务副作用停止']].map(([id,t])=><div key={id}><b>{id}</b><span>{t}</span></div>)}</div><p>检测延迟=t2−t0；执行延迟=t3−t2；业务止损延迟=t4−t0。只报告规则下发成功，不能说明业务已经停止。需同时报告并发agent数、消息尺寸、吞吐、P50/P95/P99、超时、误报和恢复条件。</p><Matrix headers={['验收项','要验证的条件']} rows={[
 ['路径覆盖','直连、备用网络、本地模型、IPv4/IPv6、长连接与DNS是否在边界内'],['控制权隔离','agent和被攻陷主机是否能改写策略、凭证或DPU执行点'],['软件/硬件失联','Supervisor或DPU断连时选择失败关闭还是继续运行，怎样恢复'],['撤销与副作用','取消后续模型调用、停止工作负载、撤销已发起工具三者分别确认'],['证据质量','签名与身份关联、日志丢失、重放、采集与存储权限'],['版本与交付','Sentry包/镜像、DOCA/BSP/固件、硬件SKU和支持矩阵'],
 ]}/><p className="guide-note">OpenShell源码可见冻结自有进程的实现；不能把这条软件机制标成Sentry DPU已验证的停止方式。<Evidence ids={['SEC31','SEC32']}/></p><h3 className="guide-section-title">尚未公开核实的Sentry细节</h3><p>检测器是否使用特定模型及阈值、身份与委派协议、策略编译与版本同步、attested telemetry签名/证明格式、DPUs之间的一致性，以及加密租户的可见性授权，均保留待核实。</p><Evidence ids={['SEC06','SEC07','SEC08']}/></>}
 {section===7&&<><Intro title="固定版本的源码证据，与Sentry公开范围分开" ids={['SEC23','SEC32']}>本次只读检查OpenShell稳定版v0.1.3（2026-10-09提交），并记录2026-10-10的main快照。没有运行OpenShell/Sentry，也没有把main开发能力当作稳定版交付保证。</Intro><div className="sentry-revision"><strong>v0.1.3</strong><code>{revision}</code><span>main快照：eeba0e7954c0fb4d8e9e2e29d1bfa68e290eb8b3</span></div><div className="table-scroll"><table className="guide-relations"><thead><tr><th>核对对象</th><th>固定源码路径</th><th>可以确认</th></tr></thead><tbody>{sourceRows.map(([name,id,path,meaning])=><tr key={id}><td>{name}<Evidence ids={[id]}/></td><td><code>{path}</code></td><td>{meaning}</td></tr>)}</tbody></table></div><p className="guide-note">在该固定版本的README、docs、crates、rfc范围内检索Sentry/BlueField/DOCA，未定位NVIDIA Sentry的DPU实现或公开接口；唯一同名sentry命中属于gVisor注释。这个有范围的检索结果不证明NVIDIA没有其他交付物或内部实现。</p><h3 className="guide-section-title">各机制的关系</h3><Relationships/><p>Astra控制SuperNIC管理权，Argus观察授权可见的运行状态，Sentry治理agent活动，Realm保护执行域，IMEX管理映射授权。公开证据没有建立Sentry必须依赖Astra、等同Argus或替代IMEX的结论。</p><Evidence ids={['SEC01','SEC04','SEC07','SEC12','SEC13']}/><figure className="guide-official"><OfficialImage asset={getComponentPhotos('sentry')[0]} eager/><figcaption>© NVIDIA Corporation · <a href={getComponentPhotos('sentry')[0].sourcePage} target="_blank" rel="noreferrer">官方Open Agent Safety参考图与原文</a></figcaption></figure></>}
 </div>}
