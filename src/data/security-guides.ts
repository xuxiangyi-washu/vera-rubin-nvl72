export interface GuideFact { title:string; text:string; sources:string[]; note?:string }
export const astraSteps:GuideFact[]=[
 {title:'管理侧提交策略',text:'服务提供方从 DPU 带外入口提交网络配置、租户隔离与资源策略。入口的身份、授权及审计需要按实际平台配置。',sources:['SEC01']},
 {title:'BlueField-4 承载控制',text:'基础设施软件运行在 DPU 的独立执行域，DOCA 服务负责网络、存储、遥测与设备生命周期。租户 OS 不承担 SuperNIC 管理职责。',sources:['SEC01']},
 {title:'专用连接配置 SuperNIC',text:'DPU 通过 Astra 专用连接编程、配置和监控 ConnectX-9。每托盘的两个四端点板组由一个 BlueField-4 管理。',sources:['SEC01','HW90'],note:'具体控制协议、密码套件与密钥协商未完整公开。'},
 {title:'硬件执行，数据面运行',text:'SuperNIC 在硬件上执行下发策略，租户通过数据面搬运 AI 数据。Astra 配置下，SuperNIC 按设计锁定并由 DPU 管理。',sources:['SEC01','SEC02'],note:'控制权在 DPU，不等于所有张量数据都绕经 DPU 外部端口。'},
 {title:'观测、更新与生命周期',text:'DPU 侧持续配置和监控；DMS 管理设备生命周期，Argus 提供运行时可见性。审计记录、故障恢复和策略撤销应纳入部署验收。',sources:['SEC01','SEC04']},
];
export const confidentialPaths:GuideFact[]=[
 {title:'CPU / Realm 内存',text:'Vera 基于 Arm CCA/RME 提供 Realm/CVM 隔离，并公开每 VM 独立加密密钥。宿主的管理权限不应等同于读取 Realm 私有内存的权限。',sources:['SEC10','SEC12'],note:'Vera 的密钥生成、存放、轮换、迁移与销毁状态机未完整披露。'},
 {title:'CPU ↔ GPU',text:'Vera 与本地 Rubin 通过 NVLink-C2C 一致性互联。官方明确 authenticated C2C encryption；产品表 1.8 TB/s 是每 Superchip 聚合口径。',sources:['SEC10','SEC11','HW03'],note:'不自行指定 AES 位数、会话建立报文、轮换间隔或每 GPU 独占带宽。'},
 {title:'GPU ↔ GPU',text:'官方确认 GPU—GPU NVLink encryption，并将 CPU、GPU 和互联纳入机架级机密计算。图中的 switch fabric 表示 GPU 间逻辑可达。',sources:['SEC11'],note:'端到端或逐跳、交换 ASIC 是否持钥、加密条件下 SHARP 的实现细节均待核实。'},
 {title:'可信设备 I/O',text:'SPDM 负责设备身份、测量及安全会话；TDISP 管理分配给 TEE 的接口；PCIe IDE 保护 TLP 数据通路。接口授权与 IDE 都满足条件后才允许机密 DMA。',sources:['SEC17','SEC18','SEC20'],note:'这是安全依赖关系，不能将“先开放 DMA、后补加密”作为部署时序。'},
 {title:'机架外网络',text:'NVLink 的保护不自动覆盖外部网络。业务需单独配置合适的 TLS、IPsec、PSP 或其他传输保护，并确认实际终止点与 fast path。',sources:['HW90','HW11'],note:'DOCA 3.5.0 明确 NVL72 所用 ConnectX-9 不支持 TLS 硬件卸载；软件 TLS 是另一层能力。'},
 {title:'检查点与持久存储',text:'模型权重、优化器状态及恢复元数据可能离开 GPU/CPU 内存进入外部存储。传输保护与对象/卷的落盘加密需要独立配置和密钥管理。',sources:['HW90'],note:'网络密文落到存储后是否继续加密，不能由 NVLink、PCIe IDE 或 TLS 的存在推断。'},
];
export const confidentialSteps:GuideFact[]=[
 {title:'定义允许的硬件与固件',text:'建立设备身份、固件版本、更新和撤销基线；核验根信任与测量来源。Caliptra 在具体 Vera/Rubin 芯片的绑定不能仅凭名称推断。',sources:['SEC11','SEC17','SEC22']},
 {title:'验证 CPU 与 guest',text:'核验 CPU/平台与 Realm/guest 的证明材料，检查工作负载身份与预期状态。平台宣称支持 CCA，不等于本次租户环境已经满足策略。',sources:['SEC10','SEC12']},
 {title:'验证 GPU 与组成员',text:'检查 GPU 身份、固件、安全能力与工作负载分配，并核验允许加入同一通信域的设备集合。Rubin 具体工具、证书及支持矩阵仍需厂商版本资料。',sources:['SEC11']},
 {title:'使设备 I/O 安全就绪',text:'认证设备并完成可信接口分配，同时建立正确的 IDE stream 保护。结合 IOMMU 与设备权限验证 DMA 可达范围。具体协议消息顺序服从平台实现。',sources:['SEC17','SEC18','SEC20']},
 {title:'按策略释放业务密钥',text:'验证者结合证据、租户身份、授权和组成员策略，决定是否向允许的工作负载释放业务密钥。这里描述验收设计，未声称 NVL72 默认部署了某个 KMS。',sources:['SEC10','SEC11','SEC12']},
 {title:'撤销、恢复与再验证',text:'设备移除、重置、固件升级、作业结束或证明失效时，重新评估访问与密钥授权。恢复流程、失败处理和证据留存需作为独立验收项。',sources:['SEC11','SEC18']},
];
export const securityRelations=[
 {name:'Astra',scope:'基础设施控制权',description:'以 DPU 为管理执行域，控制 SuperNIC 配置、策略和监控。',limit:'不能代替 Realm 隔离或租户远程证明。',sources:['SEC01','SEC02']},
 {name:'Realm VM',scope:'工作负载执行环境',description:'基于 Vera / Arm CCA 的机密执行与内存隔离。',limit:'具体设备直通与安全 I/O 仍须建立。',sources:['SEC10','SEC12']},
 {name:'DOCA Argus',scope:'运行时观察',description:'DPU 通过 DMA 分析选定、授权可见的主机内存结构。',limit:'不能推断可以读取 Realm 私有页。',sources:['SEC04','SEC12']},
 {name:'Sentry',scope:'Agent 活动治理',description:'基于 DOCA 和 BlueField-4 的带外 watchdog 参考设计。',limit:'不等于 Astra，不证明能理解所有 GPU/NVLink 载荷。',sources:['SEC06','SEC07']},
 {name:'IMEX',scope:'跨 OS 显存映射授权',description:'通过 domain/channel 协调导出、导入与映射生命周期。',limit:'不转发张量；Vera Rubin 具体部署绑定待核实。',sources:['SEC13','SEC15']},
];
