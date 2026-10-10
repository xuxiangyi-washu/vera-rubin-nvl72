# Vera Rubin NVL72 硬件证据与连接模型

核验日期：2026-10-10。仅讨论 Vera Rubin NVL72。事实以官方当前页面与有日期技术文章分别记录；有冲突时并列，不能把各来源的最大数值拼接成一个出货规格。本项目是可交互的结构与数据流解释，不是电气布线、性能、密码协议或散热数值模拟器。

## 本地材料使用范围

已实际读取文档 A：`NVIDIA-Vera-Rubin-NVL72-机密计算技术报告-修订版0908.docx`。使用 OOXML 提取正文；已定位第1章1.1–1.3、第2章开头、第2章2.2/2.6及第4章4.1。段落位置分别为 P22（机柜）、P54（计算托盘）、P58（交换托盘）、P68（C2C）、P79/P201（Astra）。DOCX 未渲染分页，因此只引用章节与提取段落，不把提示词中的“第6页”伪称为实测页码。[HW90]

已实际读取并渲染核对文档 B：`NVIDIA_NVL72_公开资料技术综述.pdf` 第4页第3章，及第21页来源索引 R1–R6。其第4页已经记录 22/19.2 TB/s、3.6/3 TB/s、260/216 TB/s 的不同公开口径及 1,400 TB/s 整柜 HBM。文档 C 属安全专题，参见项目安全说明。[HW91]

## 资料调研摘要表

| 模块/主题 | 官方型号 | 关键规格 | 连接关系 | 功能 | 来源/章节 | 可信度 |
|---|---|---|---|---|---|---|
| 整柜 | Vera Rubin NVL72 / DGX Vera Rubin NVL72 | 18计算托盘、9交换托盘；72 GPU、36 CPU | 后部铜缆spine连接计算与交换托盘 | 72 GPU Scale-Up域 | [HW01](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html)，Rack Configuration；A 1.1 | 已确认 |
| 计算托盘 | Vera Rubin Compute Tray | 2 Superchip；2 CPU+4 GPU | 后部NVLink、电力、液冷；PCB/PCIe设备连接 | 可维护计算节点、运行OS | [HW06](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/)，Compute trays；A 1.2 | 已确认 |
| GPU | NVIDIA Rubin GPU | **3360亿**晶体管、224 SM、896 Tensor Core；最高288GB HBM4；最高50PFLOPS NVFP4推理 | C2C至CPU，NVLink至交换fabric，PCIe设备I/O | AI训练/推理、HBM、GPU TEE | [HW05](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)，GPU architecture；产品页推理脚注为稀疏口径 | 已确认；峰值不等于应用吞吐 |
| GPU带宽 | Rubin GPU | HBM 22 vs 19.2TB/s；NVLink 3.6 vs 3TB/s | 本地内存 vs 机柜fabric，两类带宽 | 内存与Scale-Up | [HW05](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)；[HW03](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)，Specs | 冲突 |
| CPU | NVIDIA Vera CPU | 88 Olympus核、176线程；最高1.5TB LPDDR5X；整柜最高54TB | C2C至GPU、PCIe设备I/O | OS、预处理、内存与执行编排 | [HW12](https://www.nvidia.com/en-us/data-center/vera-cpu/)，Features；[HW03](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)，Specs | 已确认 |
| C2C | 第二代 NVLink-C2C | 产品表1.8TB/s位于Superchip列；整柜约65TB/s | 1 CPU与其2 GPU的一致性互联 | CPU-GPU共享地址与一致性访问 | [HW03](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/)，NVLink-C2C Bandwidth行；A 2.2 | 已确认聚合口径；逐分支分配待核实 |
| 交换托盘 | NVLink 6 Switch Tray | 9×4=36 ASIC；每ASIC 72 NVLink6端口 | 经spine服务72 GPU | SHARP、collectives、可达性 | [HW01](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html)，NVLink Switch Trays；[HW07](https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/)，Performance | 已确认；逐GPU物理端口映射待核实 |
| 交换维护 | NVLink 6 | 热插拔托盘、动态重路由、部分配置运行 | 管理面与fabric | 维护与可恢复运行 | [HW07](https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/)，Intelligent resiliency | 已确认能力主张；故障SLA待核实 |
| Scale-Out端点 | ConnectX-9 SuperNIC | **144×800Gb/s单口OSFP端点**；每托盘8端点，分两个四端点板组 | OSFP到Spectrum-X或Quantum-X800；PCIe到主机侧 | RDMA/RoCEv2/GPUDirect | [HW04](https://www.nvidia.com/en-us/data-center/dgx-vera-rubin-nvl72/)，Networking；[HW02](https://docs.nvidia.com/dgx/dgxvr-user-guide/networking.html)，Interfaces；[HW11](https://networking-docs.nvidia.com/connectx9hw/introduction) | 已确认；1.6Tb/s是每GPU网络口径 |
| DPU | NVIDIA BlueField-4 | 18个；DGX配置为双400Gb/s端口 | 存储Ethernet、管理端口、Astra专用控制至SuperNIC | 基础设施卸载、策略及控制隔离 | [HW04](https://www.nvidia.com/en-us/data-center/dgx-vera-rubin-nvl72/)，Networking；[HW02](https://docs.nvidia.com/dgx/dgxvr-user-guide/networking.html)，Ports；A 4.1 | 已确认 |
| 后部互联 | NVLink 6 spine / cable cartridge | 约5000铜缆；MGX最多4 cartridge，A图1采用4 | 托盘后盲插至交换结构 | 机架被动铜互联 | [HW07](https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/)，Performance；[HW08](https://developer.nvidia.com/blog/?p=113993)，MGX；A 1.1 | 已确认规模；精确布线待核实 |
| 供电 | DGX VR Power Shelf / busbar | 4×110kW额定层；54V DC；每层6个18.3kW风冷PSU | AC输入→电源层→busbar→托盘 | 配电 | [HW01](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html)，Power Shelves | 已确认；440kW是额定容量和，不是实测耗电 |
| 液冷 | manifold / cold plates | CPU/GPU及部分网络/存储冷板；液冷busbar | manifold→托盘冷板→回水 | 热量搬运 | [HW01](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html)，Compute Trays / Power Shelves | 已确认；整柜无风扇说法错误 |
| 管理 | BMC / HMC / TOR | 2管理TOR；BMC 1GbE RJ45 | BMC、DPU BMC、switch管理口→ipminet | 带外资源管理与恢复 | [HW01](https://docs.nvidia.com/dgx/dgxvr-user-guide/hardware.html)，OOB；[HW02](https://docs.nvidia.com/dgx/dgxvr-user-guide/networking.html)，Network ports | 已确认；不是已证明的线性密码信任链 |
| 网络密码能力 | ConnectX-9 | IPsec、PSP；本机架CX9不支持DOCA TLS硬件卸载 | 网络外部传输须另配策略 | 在途保护取决于SKU/配置 | [HW11](https://networking-docs.nvidia.com/connectx9hw/introduction)，Crypto；[HW10](https://networking-docs.nvidia.com/doca/archive/3-5-0/doca-tls-offload)，Prerequisites | 已确认版本约束；纠正用户泛称TLS硬件加速 |
| Scale-Out交换平台 | Spectrum-X / Spectrum-6；Quantum-X800 | Ethernet/RoCE或InfiniBand；Quantum支持SHARP v4 | 多NVL72机柜互联 | 跨柜训练推理 | [HW14](https://www.nvidia.com/en-us/networking/spectrumx/)；[HW13](https://www.nvidia.com/en-us/networking/products/infiniband/quantum-x800/)，Components | 已确认 |
| MaxLPS | NVIDIA DSX MaxLPS | 最多40%更多GPU容量的工厂规划主张 | 电力预算、动态功率和45°C液冷协同 | 提升既定供电预算下产出 | [HW09](https://developer.nvidia.com/blog/maximizing-ai-factory-performance-per-watt-with-nvidia-dsx-maxlps/)，工厂规划 | 已确认厂商预测；不是任意负载保证 |

## 数量清单

官方机柜配置图的纵向顺序：顶部2个管理ToR、2个电源层、10个计算托盘、9个NVLink交换托盘、8个计算托盘、底部2个电源层。3D按此顺序表达，几何尺寸仍为示意。[HW01，Rack Configuration]

| 实体 | 单机柜数量 | 单托盘或计算关系 |
|---|---:|---|
| Compute Tray | 18 | 每托盘两个Superchip |
| Vera Rubin Superchip | 36 | 18×2 |
| Vera CPU | 36 | 每Superchip一个 |
| Rubin GPU | 72 | 每Superchip两个 |
| ConnectX-9端点 | 144 | 每托盘8；不等于144块可拆卸完整PCIe卡 |
| ConnectX-9四端点板组 | 36 | 每托盘2 |
| BlueField-4 DPU | 18 | 每托盘1 |
| NVLink Switch Tray | 9 | 每托盘4 ASIC |
| NVLink 6 ASIC | 36 | 9×4；每ASIC 72端口 |
| NVLink spine | 1套 | 约5000铜缆不是5000条软件link实体 |
| Cable cartridge | 4（本项目A图1配置） | 官方MGX表述为最多4 |
| Power Shelf | 4 | 每层110kW额定 |
| 管理TOR | 2 | DGX VR参考配置 |

数量来自 HW01、HW02、HW04、HW06、HW07、HW08 与 A 1.1–1.3。总数由明确单元数量相乘的项目属于算术推导，不代表已核验每个端口的电气连接。

## 网络、数据面、控制面

红色 Scale-Up：GPU→后部NVLink spine→NVLink switch fabric→目标GPU。72 GPU具备逻辑all-to-all可达性；一次传输不依次经过36颗交换ASIC。蓝色 Scale-Out：GPU/CPU工作负载通过PCIe设备通路和ConnectX-9，进入外部Spectrum-X Ethernet或Quantum-X800 InfiniBand网络。[HW02][HW03][HW07]

绿色 Scale-In 是本项目按用户需求设置的**基础设施视图分类**，用于组织BlueField-4、Astra、存储及管理，不把它宣称为与Scale-Up/Out同义的独立物理fabric标准。A 第2章开头明确把BlueField职责视作基础设施处理，未单独定义第三种数据流类型。存储Ethernet可离开机柜；不能因为被画在绿色层就认为只能柜内传输。[HW90，第2章开头；HW02，Network Overview]

Astra控制连接从DPU到各ConnectX-9，负责策略、配置和监控；它不是全部租户数据必须绕经DPU外部端口的证据。存储数据连接、Astra控制连接、带内管理及灰色BMC带外管理应使用不同线型。管理网络包含独立computenet、storagenet、ipminet等角色，不能把一条绿线同时解释成所有管理、存储和安全协议。[HW90，第2章2.6、第4章4.1/4.3；HW02]

BMC/HMC/DPU在管理视图中可表示控制与恢复关系，但硬件指南只确认BMC与HMC共同提供OOB管理；没有据此证明“BMC认证HMC、HMC认证DPU”的固定线性密码信任链。信任链应另以设备身份、固件测量与验证者授权解释。[HW01]

## 必须呈现的冲突与纠错

| 项目 | 公开技术文章 | 2026-10-10现行产品页 | 本项目处理 |
|---|---|---|---|
| 单GPU NVLink双向 | 3.6TB/s | 3TB/s | 并列显示，保留来源；不猜降频/开销原因 |
| 整柜NVLink双向 | 约260TB/s | 216TB/s | 并列显示；260含四舍五入 |
| 单GPU HBM | 最高22TB/s | 19.2TB/s | 并列显示 |
| 整柜HBM | 用户提示词引用1580TB/s | Vera及DGX两页当前均1400TB/s | 1580仅保留为用户输入中的未复现旧口径；不能标“当前DGX产品页” |
| ConnectX-9 | 平台博客1.6Tb/s**每GPU** | DGX页144×800Gb/s**单端点** | 纠正“每端点1.6Tb/s”；八端点合计6.4Tb/s是算术聚合，不是任意单GPU独享 |
| 晶体管 | 336 billion | 提示词写336亿 | 336 billion=3360亿，纠正十倍误差 |
| C2C | 1.8TB/s CPU-GPU一致性带宽 | 1.8TB/s写在Superchip列、65TB/s整柜 | UI标Superchip/CPU侧聚合口径；两条GPU分支共享/分配细节待核实 |
| TLS | 泛型产品或其他配置宣传可能列TLS | DOCA 3.5.0明确排除本机架所用CX9 | 不承诺该配置TLS硬件卸载；软件TLS与其它密码能力分别说明 |
| 冷却 | compute/switch trays fanless | DGX指南明确风冷PSU | 液冷核心托盘；禁止“整个机柜无风扇” |

前三项依据 HW03/HW05/HW07及B第4页。1580可能与22×72=1584的近似有关，但**没有证据可把此推测当成官方修订原因或来源**。不以乘法结果覆盖真实规格表。

## 可视化连接的证据边界

本项目可以将72 GPU连到一个fabric逻辑实体，并由fabric展开到36 ASIC；选中GPU后高亮其可达的交换fabric和目标GPU。必须写明“逻辑可达关系 / 示意路由”。已确认每ASIC有72 NVLink6端口；**每GPU实际物理link数量、单link额定带宽、端口到ASIC的完整表、布线长度及路由选择尚未在本次证据中核实**。不能由36×72端口算术就声称每GPU必然直连每颗ASIC，也不能按总带宽平均分割出已发布的单link带宽。[HW01][HW07]

计算托盘中CPU、GPU、DPU、SuperNIC的连线属于功能/协议连接示意。一般PCIe能力、RDMA能力或设备地址表不等于完整板级布线。侧栏应展示“PCIe主机/设备通路；交换与lane映射待核实”，避免把全部GPU直接连到全部DPU/NIC画成已核实物理线路。官方框图作为外链复核入口。

CPU-GPU与GPU-GPU受保护通路的存在不自动证明交换ASIC仅见密文。公开声明的NVLink encryption与未公开的端到端/逐跳实现要同时显示，尤其SHARP参与计算时不能编造密钥终止点。

## 素材与许可

`research/official-assets.json` 登记16张从官方页面实际HTML中发现的图片URL，包含机柜、后部、计算托盘官方框图、交换托盘、电源、CPU/GPU/DPU/SuperNIC与安全示意。只外链加载或提供原页入口，不向`public`复制图片。统一标注“© NVIDIA Corporation；图片来自NVIDIA官方，版权归NVIDIA所有”。未获得再分发许可；外链可用性并不构成许可保证。3D几何为本项目自行参数化示意，不声称官方CAD或精确机械模型。未发现并核验可使用的官方GLB/GLTF/STEP文件，不编造模型下载地址。

## 来源清单

机器可读记录见 `research/hardware-sources.json`，含标题、URL、章节、主张、可信度与读取日期；本文件表格中的HW编号与该文件一一对应。A/B的本地绝对路径同时保存在记录中。网页可能后续修订，事实UI必须保留日期与冲突状态。
