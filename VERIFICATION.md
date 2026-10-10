# Vera Rubin NVL72 核验与交付自检

核验日期：2026-10-10。本项目区分公开事实、教学模型、实际浏览器操作和真实硬件测试。

## 可复现检查

| 项目 | 结果与证据 |
|---|---|
| 依赖与运行 | React18 / TypeScript / Vite8；锁文件；Node26.3.1、npm11.16.0 |
| TypeScript与生产构建 | `npm run build`通过，产物为dist；大小明细见research/build-manifest.json |
| 自动测试 | `npm test`，16项：10项拓扑/来源，3项Ring数值，3项AEAD正确性 |
| 数据规模 | 428实体、783逻辑连接、861逻辑端口、27模型类别、76条模型级规格、46条来源 |
| 官方图片 | 22个官方外链；public/assets/official仅清单与说明，无官方原图文件 |
| 开发预览 | 本次使用127.0.0.1:5174；未中断用户已占用的5173 |
| Cloudflare公开访问 | 地址见下文；逐文件HTTP和SHA-256检查见research/cloudflare-deployment.json |
| PDF手册 | 47页、19张真实UI截图、自绘结构图、可点击目录/来源、QR；逐页渲染检查 |
| 真实GPU/Realm/NCCL/安全协议 | 未执行；网站不连接设备，不采集遥测 |

## 自动测试覆盖

拓扑测试验证JSON Schema、数量、唯一ID、引用完整性、每DPU对应本托盘8个CX9、NVLink逻辑汇聚、C2C聚合带宽语义、已纠正规格、官方外链来源和上下托盘分区。未知lane数仍为null，不伪造GPU到具体ASIC的逐端口映射。

Ring测试确认6-rank Reduce-Scatter和AllGather的每轮状态、最终结果[21,42,63,84,105,126]、轮次与非法输入。AEAD测试验证不可导出示例密钥、正常解密、密文/AAD篡改失败，以及认证标签有效但需要独立序号去重的重放情况。

结构测试不自动证明资料正确；事实语义按本地A/B/C及多份官方材料交叉核验。通用AES-GCM测试不证明NVLink 6采用相同算法。

## 浏览器与交互核对

macOS Safari实际显示和操作了以下内容，真实截图保存在docs/screenshots/，清单位于同目录manifest.json：

- 7个主视图：整柜、计算托盘、NVLink、三级网络、机密计算、信任链、NCCL动画。
- GPU编号检索、模块详情、托盘切换、Spectrum-X/Quantum-X800切换、官方照片放大浏览。
- NVLink源/目标GPU、交换托盘/ASIC、交换托盘细节和P2P/SHARP/MoE阶段。
- Astra、机密计算、Scale-In、Sentry、Open Agent Safety、六芯片、管理ToR、C2C和加密专题。
- NCCL逐阶段/单步，AllGather第5轮所有rank得到相同正确向量；预设token播放完成。
- 浏览器Web Crypto：正常包通过、篡改密文和AAD失败、序号检查开启时拒绝重放、关闭时接受重复包。
- 约580px窄窗口显示横向导航与节能模式；顶部仅图标的操作补充可访问名称。此项不是实体手机触摸测试。

根据截图修复了3D标签覆盖模态窗口、Astra图注遮挡及图中来源链接图标误继承整图宽度的问题。字体已整体放大。所有截图是运行界面，不是设计稿或AI生成图；截图旁解释教学含义和限制。

尚未实测：实体手机、多浏览器/操作系统矩阵、多小时压力、全部过滤组合、所有官方图浏览器加载、实际FPS/功耗/延迟/液冷与机密计算配置。未把实现或厂商峰值当成实测结果。

## 交付覆盖

| 范围 | 文件或实现 |
|---|---|
| 调研、数量与架构 | docs/HARDWARE.md、docs/SECURITY.md、前端来源库 |
| 三份本地材料 | 已读取A的DOCX和B/C PDF；不猜A的页码，不复制原文全文 |
| 数据模型 | data/nvl72-topology.json、schema、示例；src/models/types.ts |
| 写实参数化模型 | RackScene、TrayScene、SwitchTrayScene、HardwareDetails |
| 13个图文专题 | SecurityGuide及HardwareGuide、InfrastructureGuide、PlatformGuide、NvlinkSecurityGuide |
| Scale-Up交换 | FabricScene、FabricExchange；逻辑路径/SHARP示例/MoE流程 |
| 多OS/Realm概念推理 | InferenceScene、InferenceControls、utils/ring.mjs |
| 通用认证加密实验 | utils/aead-demo.mjs；实际Web Crypto教学计算 |
| 字体与小屏 | styles.css；DPR、LOD、按需渲染和粒子降级；没有固定FPS保证 |
| PDF与工作群介绍 | output/pdf/；public/guides/；docs/WORKGROUP_INTRO.txt |
| 全量源码及发布 | nvl72-source.zip、nvl72-website.zip、wrangler.jsonc |

## 事实冲突与必要纠正

| 项目 | 采用 / 保留 | 来源 |
|---|---|---|
| 晶体管 | 336 billion = **3360亿**，纠正336亿 | HW05 |
| CX9端点 | DGX VR **800Gb/s/端点**；1.6Tb/s是每GPU口径 | HW04/HW06 |
| C2C | **1.8TB/s/Superchip聚合**；逐GPU分支分配待核实 | HW03 |
| 单GPU NVLink | 3.0与3.6TB/s并列 | HW03/HW07 |
| 全柜NVLink | 216与约260TB/s并列 | HW03/HW07 |
| 单GPU HBM | 19.2与22TB/s并列 | HW03/HW05 |
| 全柜HBM | 当前产品页约1400TB/s；用户给定1580历史快照未复现 | HW03/HW04/USER |
| TLS卸载 | DOCA3.5.0明确本配置CX9不支持；不等于不允许软件TLS | HW10 |
| 电力 | 4×110kW为额定容量和；PSU仍风冷 | HW01 |
| MaxLPS | 最多40%更多GPU为厂商特定工厂规划预测，不是本项目实测 | HW09 |
| Scale-In | 南北向基础设施；不限机柜内部，不与Scale-Up/Out混为同一fabric | SEC03/HW90 |
| Sentry | 2026-09-28发布；区别NVSentinel；OpenShell无需BF4 | SEC06/SEC08/SEC21 |
| Argus | 主机内存观测不能推断为可读Realm私有页 | SEC04/SEC12 |

## 待核实清单

1. 每GPU实际NVLink lane数、单lane/port带宽、逐ASIC/端口映射、每条铜缆与软件link的对应关系。
2. 冲突带宽的SKU、批次、版本和修订原因；1580TB/s历史原始快照。
3. 每托盘PCIe交换/直连结构、lane分配、GPUDirect fast path，具体DPU对各CPU的物理路由。
4. NVLink端到端/逐跳保护、数据密钥生成者、交换ASIC密钥角色、加密下SHARP实现、AEAD算法、nonce/标签格式和重放窗口。
5. Astra专用控制通路密码协议、握手、密钥建立、轮换及重放防护。
6. Vera Realm每VM密钥的具体生成、存储、销毁、迁移与轮换机制；CPU/GPU证明组和租户密钥释放集成。
7. Argus对特定CVM/Realm页面的授权与可见性；Sentry在特定部署是否真正不可绕过，以及毫秒级指标起止、负载、分位数、超时策略。
8. IMEX在Vera Rubin上的正式支持版本、默认部署、domain/channel模型、机密计算协同及调度器/DRA绑定。
9. Caliptra在具体芯片与固件中的绑定；BMC/HMC/DPU管理总线与实际认证方向。
10. 厂商官方CAD和原图再分发许可；不提供独立官方原图文件。用户要求的UI截图保留缩略图版权说明。
11. GPU负载、实测机柜功耗、流量、延迟、温度、液冷流量/压差、实机故障恢复与跨设备FPS。

## 交付边界与发布

没有生产密钥、SPDM请求、DMA读取、TDISP状态变化或生产设备配置。浏览器仅生成当前页面的非导出AES-GCM教学密钥，使用固定教学明文，无数据上传。NVLink 6密码套件与终止点仍未披露。

公开网站：https://vera-rubin-nvl72.xuxiangyi666.workers.dev/ 。使用用户已授权的Cloudflare Workers账户，只发布dist。原始本地文档、源码、研究记录与凭证不在网站静态根目录；浏览器来源记录去除本机绝对路径。

官方图片外链与产品规格独立解读。PDF中的UI截图仅说明本网站使用，包含的NVIDIA缩略图保留版权与来源；项目不提供可独立使用的官方原图或官方CAD。
