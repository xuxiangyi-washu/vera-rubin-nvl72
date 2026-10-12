# Vera Rubin NVL72 来源与素材登记

本轮核对日期：2026-10-12；逐条核对日期见各记录，未复核项保留上轮日期。59 条事实来源记录（包含用户输入与本地材料）；22 条 NVIDIA 官方图片外链。来源注册表为 src/data/sources.json，事实与 ID 的关联为 src/data/catalog.json 及 data/nvl72-topology.json。

## 使用规则

优先读取本地 A、B、C 再用官方资料交叉核验。硬件配置采用 DGX VR 公开实例，不能把参考规格泛化为所有 OEM 出货规格。当前产品表与有日期博客冲突时并列，不任选最大值。文档 A 按章节引用，未渲染页码；B/C 按实际 PDF 页码。原始文件保留在 Downloads/集群，项目不复制用户文档全文。

“已确认”表示原始公开资料支持，不表示实测或在所有软件/SKU上均启用；“冲突”保留不同官方口径；“待核实”表示本次材料不能证实。协议通用标准不能替代 Vera Rubin 的产品支持矩阵。

## 事实来源清单

### HW01 · NVIDIA DGX VR NVL72 User Guide — Hardware

原始资料：[NVIDIA DGX VR NVL72 User Guide — Hardware](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：2026-10-07（页面更新）。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Rack Configuration; Compute Trays; NVLink Switch Trays; Power Shelves。状态：已确认。

- 18计算托盘（上10、下8），每托盘2 CPU/4 GPU；中间9交换托盘，每托盘4 ASIC、每ASIC72 NVLink6端口
- 每托盘1 BlueField-4、2 ConnectX-9 I/O板；BMC/HMC带外管理
- 4×110kW电源层（上2、下2），54V DC busbar；每层6个风冷PSU

### HW02 · NVIDIA DGX VR NVL72 User Guide — Networking

原始资料：[NVIDIA DGX VR NVL72 User Guide — Networking](https://docs.nvidia.com/dgx/dgxvr-user-guide/networking.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：2026-10-07（页面更新）。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Network Overview; Compute Tray Network Ports; Network Interface Names。状态：已确认。

- NVLink经后部铜缆cartridge连接计算及交换托盘；SHARP在网计算
- ConnectX-9 OSFP接computenet；BlueField-4 QSFP接存储Ethernet；BMC 1GbE接ipminet
- 网络表明确八个ConnectX-9端点接口

### HW03 · NVIDIA Vera Rubin NVL72 产品页

原始资料：[NVIDIA Vera Rubin NVL72 产品页](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：NVIDIA Vera Rubin NVL72 Specs; 注1–4。状态：冲突。

- 72 GPU/36 CPU；单GPU 288GB HBM4、19.2TB/s；整柜20.7TB/1400TB/s
- 单GPU NVLink 3TB/s；整柜216TB/s；与技术博客冲突
- C2C 1.8TB/s在Superchip列，整柜65TB/s；不是两条CPU-GPU边各独享1.8
- Vera 88核176线程，单CPU最高1.5TB LPDDR5X，整柜54TB

### HW04 · NVIDIA DGX Vera Rubin NVL72 产品页

原始资料：[NVIDIA DGX Vera Rubin NVL72 产品页](https://www.nvidia.com/en-us/data-center/dgx-vera-rubin-nvl72/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Specifications; Preliminary information footnote。状态：已确认。

- 144个单口OSFP ConnectX-9 VPI端点，每端点800Gb/s
- 18个双端口BlueField-4 VPI、400Gb/s；当前页面整柜HBM为1400TB/s
- 规格注明初步信息、可能变化

### HW05 · Inside NVIDIA Rubin GPU Architecture: Powering the Era of Agentic AI

原始资料：[Inside NVIDIA Rubin GPU Architecture: Powering the Era of Agentic AI](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)

类型：厂商官方资料。机构：NVIDIA。资料日期：2026-07-21。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：How does Rubin GPU architecture support agentic workloads?; Memory subsystem。状态：冲突。

- 336 billion晶体管=3360亿；224 SM；896 Tensor Core
- 第三代Transformer Engine，最高50PFLOPS NVFP4推理
- HBM4最高288GB/22TB/s；NVLink6 3.6TB/s，带宽与产品页冲突

### HW06 · Inside the NVIDIA Vera Rubin Platform: Six New Chips, One AI Supercomputer

原始资料：[Inside the NVIDIA Vera Rubin Platform: Six New Chips, One AI Supercomputer](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/)

类型：厂商官方资料。机构：NVIDIA。资料日期：2026-01-05（页面注明2026-03-16更新）。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：ConnectX-9; From chips to systems; Compute and NVLink switch trays。状态：已确认。

- 计算托盘包含两个Superchip；每Superchip为1 Vera CPU+2 Rubin GPU
- 两个quad ConnectX-9板组，对接Vera CPU；1.6Tb/s为每Rubin GPU的网络带宽
- BlueField-4/Astra独立基础设施域；受保护CPU/GPU/NVLink机架级域

### HW07 · NVIDIA NVLink: The Scale-Up Network for AI Factories

原始资料：[NVIDIA NVLink: The Scale-Up Network for AI Factories](https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/)

类型：厂商官方资料。机构：NVIDIA。资料日期：2026-07-20。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：World-leading performance; Built for speed and intelligent resiliency。状态：冲突。

- GPU双向NVLink 3.6TB/s，整柜约260TB/s；与现行产品表冲突
- 约5000条铜缆spine；每交换托盘4芯片；SHARP在网collectives
- 热插拔交换托盘、动态重路由、部分配置运行；不是未公开容错SLA

### HW08 · NVIDIA Vera Rubin POD: Seven Chips, Five Rack-Scale Systems, One AI Supercomputer

原始资料：[NVIDIA Vera Rubin POD: Seven Chips, Five Rack-Scale Systems, One AI Supercomputer](https://developer.nvidia.com/blog/?p=113993)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Third-generation NVIDIA MGX rack-scale architecture; Compute and NVLink Switch trays。状态：已确认。

- MGX spine最多4个预集成铜缆cartridge
- 计算与交换托盘无风扇的表述不能推导整柜无风扇

### HW09 · Maximizing AI Factory Performance per Watt with NVIDIA DSX MaxLPS

原始资料：[Maximizing AI Factory Performance per Watt with NVIDIA DSX MaxLPS](https://developer.nvidia.com/blog/maximizing-ai-factory-performance-per-watt-with-nvidia-dsx-maxlps/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Factory power planning and MaxLPS。状态：已确认。

- 最高40%更多Rubin GPU容量为100MW工厂规划预测，依赖负载与电力规划
- 功率预算、散热、动态功率分配的综合能力，不是单机柜实测节电40%

### HW10 · DOCA 3.5.0 — TLS Offload

原始资料：[DOCA 3.5.0 — TLS Offload](https://networking-docs.nvidia.com/doca/archive/3-5-0/doca-tls-offload)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Prerequisites / Checking Hardware Support for Crypto Acceleration。状态：已确认。

- Vera Rubin NVL72使用的ConnectX-9不支持TLS硬件加速，即使crypto-enabled OPN亦然
- 不能把ConnectX产品系列泛称TLS能力当成该机架配置已支持

### HW11 · NVIDIA ConnectX-9 SuperNIC User Manual — Introduction

原始资料：[NVIDIA ConnectX-9 SuperNIC User Manual — Introduction](https://networking-docs.nvidia.com/connectx9hw/introduction)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Product Overview; Cryptography Accelerations; Advanced AI / HPC Networking。状态：已确认。

- 最高800Gb/s InfiniBand/Ethernet；IPsec/PSP密码卸载
- RDMA、RoCEv2、GPUDirect RDMA/Storage；具体SKU/软件版本决定能力

### HW12 · NVIDIA Vera CPU 产品页

原始资料：[NVIDIA Vera CPU 产品页](https://www.nvidia.com/en-us/data-center/vera-cpu/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Features; LPDDR5X; NVIDIA NVLink-C2C。状态：已确认。

- 88 Olympus核、176线程；最高1.5TB LPDDR5X/1.2TB/s
- C2C最高1.8TB/s CPU-GPU一致性带宽

### HW13 · NVIDIA Quantum-X800 InfiniBand Platform

原始资料：[NVIDIA Quantum-X800 InfiniBand Platform](https://www.nvidia.com/en-us/networking/products/infiniband/quantum-x800/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Platform Components。状态：已确认。

- InfiniBand平台；SHARP v4、adaptive routing、telemetry-based congestion control
- 800Gb/s端到端网络；ConnectX SuperNIC最高1.6Tb/s每GPU

### HW14 · NVIDIA Spectrum-X Ethernet Platform

原始资料：[NVIDIA Spectrum-X Ethernet Platform](https://www.nvidia.com/en-us/networking/spectrumx/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Platform Components。状态：已确认。

- Spectrum交换机与ConnectX SuperNIC协同；RoCE以太网RDMA网络

### HW90 · 文档A：NVIDIA-Vera-Rubin-NVL72-机密计算技术报告-修订版0908.docx

本地/用户材料：/Users/xiangyixu/Downloads/集群/NVIDIA-Vera-Rubin-NVL72-机密计算技术报告-修订版0908.docx

类型：用户提供材料。机构：用户提供。资料日期：未知。核对日期：2026-10-10（上轮核对）。

未提供公开链接。仅能核对书目信息和已记录章节；原文由用户持有，不能充当可公开复核的唯一证据。

定位：第1章1.1–1.3及第2章开头；第2章2.2/2.6；第4章4.1。状态：已确认。

- OOXML段落P22/P54/P58硬件构成；P79/P201 Astra控制权
- 按章节引用；未渲染分页，不宣称某DOCX物理页码

### HW91 · 文档B：NVIDIA_NVL72_公开资料技术综述.pdf

本地/用户材料：/Users/xiangyixu/Downloads/集群/NVIDIA_NVL72_公开资料技术综述.pdf

类型：用户提供材料。机构：用户提供。资料日期：未知。核对日期：2026-10-10（上轮核对）。

未提供公开链接。仅能核对书目信息和已记录章节；原文由用户持有，不能充当可公开复核的唯一证据。

定位：第4页 第3章；第21页来源索引R1–R6。状态：已确认。

- 第4页记录22/19.2 TB/s、3.6/3 TB/s、260/216 TB/s公开冲突
- 第4页整柜HBM已写约1400TB/s；1580TB/s并非该页当前记录

### SEC01 · Redefining Secure AI Infrastructure with NVIDIA BlueField Astra for NVIDIA Vera Rubin NVL72

原始资料：[Redefining Secure AI Infrastructure with NVIDIA BlueField Astra for NVIDIA Vera Rubin NVL72](https://developer.nvidia.com/blog/redefining-secure-ai-infrastructure-with-nvidia-bluefield-astra-for-nvidia-vera-rubin-nvl72/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：What is NVIDIA BlueField Astra?; Figure 1; Extending operational workflows。状态：已确认。

- Astra 在 BlueField-4 上建立独立于租户主机的 SuperNIC 控制面；专用连接用于编程、配置、监控 ConnectX-9。
- 策略经 DPU 带外端口进入，在 SuperNIC 硬件执行；DOCA HBN、加速 OVS、Argus、SNAP、DMS 分担网络、安全、存储和管理。

### SEC02 · SuperNIC Lockdown Key Management — NVIDIA Infra Controller

原始资料：[SuperNIC Lockdown Key Management — NVIDIA Infra Controller](https://docs.nvidia.com/infra-controller/documentation/architecture/super-nic-lockdown-key-management)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Background。状态：已确认。

- Astra 配置下 ConnectX-9 与 BlueField-4 配对，SuperNIC 按设计锁定，仅由 DPU 管理。
- 此页其余非 Astra 锁定密钥管理细节不可移植为 Astra 专用链路的加密协议。

### SEC03 · NVIDIA BlueField-4 Powers New Scale-In Network Infrastructure for Agentic AI Factories

原始资料：[NVIDIA BlueField-4 Powers New Scale-In Network Infrastructure for Agentic AI Factories](https://developer.nvidia.com/blog/nvidia-bluefield-4-powers-new-scale-in-network-infrastructure-for-agentic-ai-factories/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Scale-In accelerates north-south AI factory infrastructure; BlueField-4 architecture。状态：已确认。

- Scale-In 覆盖 AI 工厂南北向接入、安全、数据与存储流动及基础设施操作，范围不只机柜内部。
- BlueField-4 提供独立于主机的基础设施处理，DOCA 提供服务，Spectrum-X 提供接入网络。

### SEC04 · DOCA Argus Service Guide — DOCA 3.5.0 archive

原始资料：[DOCA Argus Service Guide — DOCA 3.5.0 archive](https://networking-docs.nvidia.com/doca/archive/3-5-0/doca-argus-service-guide)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Introduction; Operation; Monitored Activity and Relationships; Requirements; Limitations。状态：已确认。

- Argus 在独立 BlueField 域通过 DOCA DMA 读取选定的易失主机内存结构，无需主机常驻代理。
- 指南支持 Linux x86 与 Arm64，解析进程、线程、执行上下文和 SHA-256 摘要；需匹配内核内存映射。
- 指南未证明 Argus 可越过 Realm 私有内存隔离，也未保证所有 Sentry 检测均使用 Argus。

### SEC05 · NVIDIA Brings Cybersecurity to Every AI Factory

原始资料：[NVIDIA Brings Cybersecurity to Every AI Factory](https://blogs.nvidia.com/blog/cybersecurity-ai-factory-doca-argus/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：April 28, 2025; runtime threat detection。状态：已确认。

- 官方称 DOCA Argus 检测速度最高为现有无代理方案的 1,000 倍；属厂商上限声明，不能当作本项目实测或 Sentry 的 SLA。

### SEC06 · NVIDIA Launches Open Agent Safety Platform to Secure Agents From Testing to Deployment

原始资料：[NVIDIA Launches Open Agent Safety Platform to Secure Agents From Testing to Deployment](https://nvidianews.nvidia.com/news/open-agent-safety-platform)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：September 28, 2026; News Summary; Sentry description。状态：已确认。

- 2026-09-28 公布的 Open Agent Safety Platform 组合 OpenShell 与 Sentry 参考系统设计。
- Sentry 是基于 DOCA、运行于 BlueField-4 的带外 watchdog，在独立信任域持续观察和执行；毫秒级隔离为厂商声明。

### SEC07 · NVIDIA Open Agent Safety Platform: A Reference for Continuous In-Silicon Agent Monitoring

原始资料：[NVIDIA Open Agent Safety Platform: A Reference for Continuous In-Silicon Agent Monitoring](https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Three open agent safety platform layers; Vera Rubin POD deployment discussion。状态：已确认。

- 参考设计把 BlueField-4 放在指定 Vera Rubin POD 中 agent 节点通往模型的必要路径。
- 该拓扑限定不能外推为所有 NVLink 流量经过 DPU、所有服务器出口均不可绕过，或 Sentry 替代 IMEX。

### SEC08 · NVIDIA Open Agent Safety Platform: Secure AI Agents

原始资料：[NVIDIA Open Agent Safety Platform: Secure AI Agents](https://www.nvidia.com/en-us/solutions/ai/agent-safety/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Overview; Technology — NVIDIA Sentry; FAQ — component roles / Does OpenShell require BlueField-4?。状态：已确认。

- OpenShell 可在受支持的本地、私有部署、云和 Kubernetes 环境运行，不要求 BlueField-4。
- 配备 BlueField-4 时 Sentry 增加硬件隔离的观察和执行；仍需具体版本及部署支持矩阵。

### SEC09 · OpenShell — The OpenShell Architecture

原始资料：[OpenShell — The OpenShell Architecture](https://build.nvidia.com/openshell/integrations)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Agent Sandboxes; Supervisor; Gateway。状态：已确认。

- Gateway 管理身份、生命周期和策略；Supervisor 在工作负载外检查出站访问；Sandbox 承载内核层文件、进程及网络约束。

### SEC10 · NVIDIA Vera CPU: Olympus Cores Built for Maximum Single-Thread Performance in Agentic AI

原始资料：[NVIDIA Vera CPU: Olympus Cores Built for Maximum Single-Thread Performance in Agentic AI](https://developer.nvidia.com/blog/?p=120182)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Confidential Compute。状态：已确认。

- Vera 的机密计算建立在 Arm CCA/RME 上，具有每 VM 加密密钥、TDISP 设备安全分配及 authenticated C2C encryption。
- 该公开章节没有给出密钥生成状态机、轮换、销毁和迁移的 Vera 具体实现。

### SEC11 · Inside the NVIDIA Vera Rubin Platform: Six New Chips, One AI Supercomputer

原始资料：[Inside the NVIDIA Vera Rubin Platform: Six New Chips, One AI Supercomputer](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/)

类型：厂商官方资料。机构：NVIDIA。资料日期：2026-01-05（页面注明2026-03-16更新）。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Third-generation confidential computing: rack-level security; Figure 29。状态：已确认。

- 官方描述横跨 CPU、GPU、互联的机架级 TEE，以及 NVLink-C2C 加密、GPU 间 NVLink 加密、PCIe IDE 和 TDISP。
- 未公开 NVLink 数据密钥生成者、端到端或逐跳实现及交换机密钥角色。

### SEC12 · Learn the architecture — Introducing Arm Confidential Compute Architecture

原始资料：[Learn the architecture — Introducing Arm Confidential Compute Architecture](https://support.arm.com/documentation/den0125/latest/Arm-CCA-Hardware-Architecture?lang=en)

类型：标准文档。机构：Arm。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Realm world requirements; Memory management for Arm CCA。状态：已确认。

- Realm 属于隔离的 Realm 安全状态；RMM 与 Root 固件参与管理，GPC/GPT 实施内存访问控制。
- Realm 隔离不等于任何外设都被授权读取私有内存；可信设备分配需独立建立。

### SEC13 · Overview — NVIDIA IMEX Service

原始资料：[Overview — NVIDIA IMEX Service](https://docs.nvidia.com/deploy/imex-service/overview.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：What is the NVIDIA Internode Memory Exchange Service?; Multi-Node Memory Sharing Model。状态：已确认。

- IMEX 协调跨 OS 域 GPU 显存导入、导出与映射生命周期，服务与 GPU 驱动交互，节点间走 TCP/IP 与 gRPC。
- 内存映射控制通路与 NVLink 上的显存读写数据通路不同；Vera Rubin 的具体部署绑定仍待核实。

### SEC14 · IMEX Service Config Options

原始资料：[IMEX Service Config Options](https://docs.nvidia.com/multi-node-nvlink-systems/imex-guide/config.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：IMEX Service Secure Connections Configuration。状态：已确认。

- IMEX_ENABLE_AUTH_ENCRYPTION 默认 0，表示关闭认证及加密。
- 启用后可选 SSL_TLS、GSS_AUTH_ENCRYPT 或 GSS_AUTH_ONLY；最后一种不加密。

### SEC15 · IMEX Channels

原始资料：[IMEX Channels](https://docs.nvidia.com/multi-node-nvlink-systems/imex-guide/imexchannels.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Default Channel Creation; Multi-user channel usage; Multi-node channels。状态：已确认。

- 驱动使用用户可访问的最低编号 channel；应使用户仅访问其授权 channel。
- 全员可访问 channel0 时，新增 channel1/channel2 不能隔离两用户；跨节点 channel 分配须一致。

### SEC16 · NCCL 2.30.3 User Guide — Environment Variables

原始资料：[NCCL 2.30.3 User Guide — Environment Variables](https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2303/user-guide/docs/env.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：NCCL_MNNVL_ENABLE。状态：已确认。

- NCCL MNNVL 从 2.21 提供，要求受支持系统/驱动、cuMem 支持以及完整可用的 IMEX domain。
- 这些通用要求不证明 Vera Rubin 当前出厂软件绑定。

### SEC17 · SPDM — DMTF Security Protocols and Data Models

原始资料：[SPDM — DMTF Security Protocols and Data Models](https://www.dmtf.org/standards/spdm)

类型：标准文档。机构：DMTF。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Working Group Description; DSP0274/DSP0277。状态：已确认。

- SPDM 提供设备认证、证明相关测量与密钥交换，承载绑定与设备数据保护应分别核验。

### SEC18 · IDE and TDISP: An Overview of PCIe Technology Security Features

原始资料：[IDE and TDISP: An Overview of PCIe Technology Security Features](https://pcisig.com/blog/ide-and-tdisp-overview-pcie%C2%AE-technology-security-features)

类型：标准文档。机构：PCI-SIG。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：IDE; TDISP。状态：已确认。

- PCIe IDE 与 TDISP 分别解决链路数据保护与 TEE 设备接口分配安全。
- 教学流程应要求设备接口与 IDE 均已就绪才允许机密 DMA；不能把先开放 DMA、后启用加密当作安全配置。

### SEC19 · NVIDIA_Sentry_架构与安全洞察报告.pdf（文档 C）

本地/用户材料：/Users/xiangyixu/Downloads/集群/NVIDIA_Sentry_架构与安全洞察报告.pdf

类型：用户提供材料。机构：用户提供。资料日期：未知。核对日期：2026-10-10（上轮核对）。

未提供公开链接。仅能核对书目信息和已记录章节；原文由用户持有，不能充当可公开复核的唯一证据。

定位：本地 PDF，19 页，资料截至 2026-10-09；p.1-3、5、9-12、16-19。状态：已确认。

- 已解析用户本地文档，发布身份与边界参见 p.1-3；数据/控制/证据流参见 p.5；可见性与机密计算边界参见 p.9-10。
- 毫秒级指标条件参见 p.11；NVLink、IMEX、Astra 分层参见 p.12、16；原始资料列表参见 p.18-19。

### SEC20 · Arm RME System Architecture Compliance Suite Scenario Document

原始资料：[Arm RME System Architecture Compliance Suite Scenario Document](https://github.com/ARM-software/rme-sysarch-acs/blob/main/Docs/Arm_RME_System_Architecture_Compliance_Suite_Scenario_Document.rst)

类型：源码仓库。机构：Arm。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Trusted device / IDE / TDISP RUN scenarios。状态：已确认。

- Arm 官方通用测试先建立 RootPort 与 Endpoint 的 IDE Stream，再转入 TDISP RUN；不能把此测试当作 Vera 的完整部署说明。

### SEC21 · NVSentinel Overview — v1.25.0

原始资料：[NVSentinel Overview — v1.25.0](https://docs.nvidia.com/nvsentinel/v1.25.0/getting-started/overview/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：What it is。状态：已确认。

- NVSentinel 面向 Kubernetes GPU 故障检测与修复，与 agent 安全参考设计 Sentry 不同。

### SEC22 · Caliptra RTL — CHIPS Alliance

原始资料：[Caliptra RTL — CHIPS Alliance](https://github.com/chipsalliance/caliptra-rtl)

类型：源码仓库。机构：CHIPS Alliance。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Caliptra overview。状态：待核实。

- Caliptra 是可集成的硬件信任根项目；其 Vera Rubin 各芯片采用版本与证明绑定在本次 NVIDIA 一手资料核验中尚未确认。

### SEC23 · OpenShell v0.1.3 — README

原始资料：[OpenShell v0.1.3 — README](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/README.md)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：How It Works; Quickstart; release v0.1.3; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- Apache-2.0开放运行时；与Sentry参考系统的公开程度分别评估。

### SEC24 · OpenShell v0.1.3 — Architecture

原始资料：[OpenShell v0.1.3 — Architecture](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/about/architecture.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：What Each Piece Does; Mediated Channel; How Components Authenticate; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- Supervisor与不可信工作负载分离；运行时建立外层网络隔离。
- Sandbox Protocol使用认证HTTP/2通道；Docker/Podman用Unix socket，Kubernetes用TCP，VM用vsock。
- Gateway JWT与Sandbox JWT按sandbox及generation绑定；这不是Sentry身份协议披露。

### SEC25 · OpenShell v0.1.3 — Policy Prover

原始资料：[OpenShell v0.1.3 — Policy Prover](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/how-it-works/policies/prover.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Read the Result; What the Boundary Check Covers; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- SMT检查boundary containment及提案风险；两者不等价。
- within_boundary仅覆盖模型语义；unsupported/inconclusive不是通过。
- GraphQL/MCP等运行时支持不等于当前boundary prover也覆盖。

### SEC26 · OpenShell v0.1.3 — Network Rules

原始资料：[OpenShell v0.1.3 — Network Rules](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/how-it-works/policies/network-rules.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Connection and Request Checks; Enforcement; Network Access and Credentials; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- 先检查host/port/binary，再按协议检查请求。
- L7默认audit记录违规但继续转发；enforce才阻断相应规则违规。
- 连接授权不自动授权发送provider凭证。

### SEC27 · OpenShell v0.1.3 — Providers

原始资料：[OpenShell v0.1.3 — Providers](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/how-it-works/providers/overview.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：How Credential Injection Works; Fail-closed behavior; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- 托管凭证以占位符呈现给agent；代理按network policy和credential binding双重授权替换。
- 目标host/port/path不匹配、占位符无效时拒绝；TLS skip和非HTTP隧道不能重写。

### SEC28 · OpenShell v0.1.3 — OCSF JSON Export

原始资料：[OpenShell v0.1.3 — OCSF JSON Export](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/observability/ocsf-json-export.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Gateway Output; Output Location; JSON Record Structure; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- 结构化日志是best-effort，不能保证完整审计历史。
- metadata.uid是事件标识，container.uid关联sandbox；队列、落盘与外部采集决定保留和丢失。
- OCSF结构本身不是Sentry attested telemetry的签名或证明协议。

### SEC29 · OpenShell v0.1.3 — Policy Advisor

原始资料：[OpenShell v0.1.3 — Policy Advisor](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/how-it-works/policies/advisor.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：How the Policy Advisor Works; Proposal Risk Check; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- agent可提出网络规则；默认需人工审批，advisor默认关闭。
- 提案不自行生效，自动审批是另行启用的选项；风险检查不等于任务意图完备证明。

### SEC30 · OpenShell v0.1.3 — Docker outer fence source

原始资料：[OpenShell v0.1.3 — Docker outer fence source](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/crates/openshell-driver-docker/src/isolation.rs)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：DockerOuterFenceEvidence::project; DockerBoundarySpec::provision; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- network_mode=none及无非托管网络附件用于生成和校验外层隔离条件。
- 源码范围是OpenShell Docker运行时，不能当成BlueField硬件证明。

### SEC31 · OpenShell v0.1.3 — Workload freeze source

原始资料：[OpenShell v0.1.3 — Workload freeze source](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/crates/openshell-sandbox/src/boundary_io.rs)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：BoundaryRuntime::freeze / resume; SIGSTOP/SIGCONT handling; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- 冻结自有工作负载进程并阻止新操作是可见源码机制。
- 它不能证明Sentry在DPU上使用相同信号机制，也不是实机毫秒级测量。

### SEC32 · OpenShell v0.1.3 — Support Matrix

原始资料：[OpenShell v0.1.3 — Support Matrix](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/about/support-matrix.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Releases; Runtimes; Kernel Requirements; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- 稳定版、预发布版和main开发快照需区分；支持范围按runtime、OS和kernel核验。

### SEC33 · OpenShell v0.1.3 — Security Best Practices

原始资料：[OpenShell v0.1.3 — Security Best Practices](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/security/best-practices.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：L4-Only vs L7 Inspection; TLS Handling; Gateway Security; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- TLS终止使代理能做L7检查；tls:skip保留不透明载荷，不等于内容检查。
- 不将软件Supervisor独立进程等同于DPU主机外硬件信任域。

### SEC34 · OpenShell v0.1.3 — Default Policy and Baseline Paths

原始资料：[OpenShell v0.1.3 — Default Policy and Baseline Paths](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/docs/how-it-works/policies/default-policy.mdx)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：When the Default Applies; Default Network Access; Inspect the Selected Policy; commit e1f3c82caa3ed3b65de22889ae7ef32a774878ef。状态：已确认。

- 不传--policy不保证使用默认策略；镜像、全局策略和provider组合会改变有效策略。
- 需要检查base/full与实际运行时附加权限。

### SEC35 · OpenShell v0.1.3 — Landlock backend comment

原始资料：[OpenShell v0.1.3 — Landlock backend comment](https://github.com/NVIDIA/OpenShell/blob/e1f3c82caa3ed3b65de22889ae7ef32a774878ef/crates/openshell-sandbox/src/sandbox/linux/landlock.rs#L261)

类型：源码仓库。机构：NVIDIA。资料日期：2026-10-09（固定v0.1.3提交）。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Landlock ABI probe; gVisor sentry comment。状态：已确认。

- 此处sentry指gVisor组件，不是NVIDIA Sentry硬件治理实现。

### VIS01 · 用户指定视觉参考：StorageReview Vera Rubin NVL72 报道

原始资料：[用户指定视觉参考：StorageReview Vera Rubin NVL72 报道](https://www.storagereview.com/news/nvidia-launches-vera-rubin-architecture-at-ces-2026-the-vr-nvl72-rack)

类型：第三方报道 / 视觉参考。机构：StorageReview。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅作外观视觉参考，不据此证明精确布线、数量、端口映射或性能。

定位：A Cable-Free Rack Designed for Massive Scale；只作外观方向参考。状态：已确认。

- 据用户提供的文章改进计算托盘、冷板、金属外壳和组件图片展示。图片实际引用NVIDIA原始来源，不复制报道的未核实规格。

### NC01 · NCCL User Guide — Collective Operations

原始资料：[NCCL User Guide — Collective Operations](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：AllReduce; ReduceScatter; AllGather; AlltoAll。状态：已确认。

- ReduceScatter后接AllGather等价于AllReduce；各rank必须匹配collective的count和datatype。
- 教学Ring数值模拟不证明任何Vera Rubin跨Realm配置已受支持。

### NC02 · NCCL User Guide — Creating a Communicator

原始资料：[NCCL User Guide — Creating a Communicator](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/communicators.html)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-12。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Creating a Communicator。状态：已确认。

- communicator为参与CUDA设备分配唯一rank；unique ID经主机通信机制在进程间共享。
- NCCL初始化不是Realm证明或密钥释放协议。

### SW01 · NVIDIA Dynamo Documentation

原始资料：[NVIDIA Dynamo Documentation](https://docs.nvidia.com/dynamo/)

类型：厂商官方资料。机构：NVIDIA。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Overview / distributed inference serving。状态：已确认。

- Dynamo提供分布式推理服务相关能力；实际配置以版本文档为准。

### SW02 · NVIDIA TensorRT-LLM Documentation

原始资料：[NVIDIA TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)

类型：第三方报道。机构：nvidia.github.io。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Overview / inference optimization。状态：已确认。

- TensorRT-LLM为大模型推理提供优化执行能力；模型与硬件支持需核验具体版本。

### CR01 · NIST SP 800-38D — GCM and GMAC

原始资料：[NIST SP 800-38D — GCM and GMAC](https://csrc.nist.gov/pubs/sp/800/38/d/final)

类型：标准文档。机构：NIST。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：Authenticated encryption with associated data; IV requirements。状态：已确认。

- 用于解释通用AEAD与GCM，不作为NVLink6密码算法或参数的证据。

### CR02 · W3C Web Cryptography API

原始资料：[W3C Web Cryptography API](https://www.w3.org/TR/webcrypto/)

类型：标准文档。机构：W3C。资料日期：未知。核对日期：2026-10-10（上轮核对）。

仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。

定位：AES-GCM; SubtleCrypto encrypt/decrypt; generateKey。状态：已确认。

- 浏览器AES-GCM教学演示使用Web Crypto；不是NVLink6实现。

### USER · 用户任务说明（2026-10-10）

本地/用户材料：用户在本轮消息给出的规格说明

类型：用户提供材料。机构：用户提供。资料日期：未知。核对日期：2026-10-10（上轮核对）。

未提供公开链接。仅能核对书目信息和已记录章节；原文由用户持有，不能充当可公开复核的唯一证据。

定位：用户提供的规格与历史口径；非官方独立证据。状态：待核实。

- 1580 TB/s 原始历史页面快照未复现

## 图片素材与再分发边界

未查获能明确授权本项目再分发的图片许可，因此所有官方图片只通过原始 HTTPS 地址外链。UI 显示“图片来自 NVIDIA 官方，版权归 NVIDIA 所有”和 © NVIDIA Corporation。图片加载失败时仍有原图入口。public/assets/official 只存外链清单与说明，不包含图片二进制。

本项目未找到并采用可明确再分发的官方 GLB/GLTF/STEP。全部 3D 网格、材质、图例均为本项目参数化代码，不冒充官方 CAD，不使用 AI 生成图。无需下载额外模型才能运行七个视图。未使用位图纹理，纹理压缩不适用。

| ID | 图像 | 原始文件名 | 官方原图 | 来源页 | 许可处理 |
|---|---|---|---|---|---|
| IMG01 | 机柜正面配置 | hardware-rack-configuration-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-rack-configuration-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG02 | 机柜后部spine/液冷/母排 | hardware-rack-rear-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-rack-rear-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG03 | 计算托盘 | hardware-compute-tray-vrnvl72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-compute-tray-vrnvl72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG04 | 计算托盘官方框图 | hardware-compute-tray-block-diagram-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-compute-tray-block-diagram-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG05 | 计算托盘俯视 | hardware-compute-tray-top-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-compute-tray-top-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG06 | 计算托盘前视 | hardware-compute-tray-front-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-compute-tray-front-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG07 | NVLink Switch Tray俯视 | hardware-nvlink-switch-tray-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-nvlink-switch-tray-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG08 | 电源层 | hardware-power-shelf-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-power-shelf-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG09 | 带外管理TOR | hardware-tor-ethernet-VRNVL72.png | [原图](https://docs.nvidia.com/dgx/dgxvr-user-guide/_images/hardware-tor-ethernet-VRNVL72.png) | [来源](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html) | © NVIDIA；仅外链；不再分发 |
| IMG10 | Vera CPU官方规格图 | Figure-5-new-png.webp | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/Figure-5-new-png.webp) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG11 | Rubin GPU官方规格图 | image-33-1.png | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/image-33-1.png) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG12 | NVLink 6 Switch官方图 | image11.png | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/image11.png) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG13 | ConnectX-9官方图 | Figure-12.png | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/Figure-12.png) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG14 | BlueField-4 DPU官方图 | image28-png.webp | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/image28-png.webp) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG15 | Vera Rubin Superchip官方图 | image9.png | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/image9.png) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG16 | 机架级机密计算官方示意 | image-32-png.webp | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/image-32-png.webp) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG17 | Vera Rubin 计算托盘官方产品图 | Figure-18.png | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/Figure-18.png) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG18 | ConnectX-9 与 BlueField-4 官方模块图 | image-28-1-png.webp | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/image-28-1-png.webp) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG19 | NVLink Switch Tray 官方产品图 | image17-png.webp | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/image17-png.webp) | [来源](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | © NVIDIA；仅外链；不再分发 |
| IMG20 | BlueField Astra 官方架构图 | nvidia-vera-rubin-nvl72-compute-tray-1-png.webp | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/01/nvidia-vera-rubin-nvl72-compute-tray-1-png.webp) | [来源](https://developer.nvidia.com/blog/redefining-secure-ai-infrastructure-with-nvidia-bluefield-astra-for-nvidia-vera-rubin-nvl72/) | © NVIDIA；仅外链；不再分发 |
| IMG21 | Scale-In 官方基础设施架构图 | image-30-1024x563.png | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/08/image-30-1024x563.png) | [来源](https://developer.nvidia.com/blog/nvidia-bluefield-4-powers-new-scale-in-network-infrastructure-for-agentic-ai-factories/) | © NVIDIA；仅外链；不再分发 |
| IMG22 | Open Agent Safety Platform 官方参考设计 | NVIDIAAgentSafetyPlatform_1920x1080_Title_v05.webp | [原图](https://developer-blogs.nvidia.com/wp-content/uploads/2026/09/NVIDIAAgentSafetyPlatform_1920x1080_Title_v05.webp) | [来源](https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/) | © NVIDIA；仅外链；不再分发 |

## 真实UI截图

按用户要求，使用说明PDF包含本项目的20张真实Safari界面截图，原始截图位于docs/screenshots。截图为操作说明，部分含NVIDIA图片的缩略呈现，版权归NVIDIA；没有提供可独立使用的官方原图文件。截图说明与对应来源记录见PDF第23章。界面、参数化几何和解释图由本项目实现。

## 软件与图标

界面图标使用 lucide-react（ISC；见 node_modules/lucide-react/LICENSE）。React、Vite、Three.js、React Three Fiber、Drei、Zustand、TypeScript、Ajv 的许可按各依赖包 LICENSE 与锁文件登记。界面使用系统字体，不打包或远程加载字体文件。

构建依据：[Vite 官方入门](https://vite.dev/guide/)；渲染性能依据：[React Three Fiber scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)。项目采用实例化、LOD、按需渲染及自适应 DPR；动画是结构解释，不是网络实测。
