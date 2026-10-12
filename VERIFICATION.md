# Vera Rubin NVL72 核验与交付自检

> 发布授权更新：用户已明确确认“提交并推送 GitHub，再分别发布到 Cloudflare 和 CloudBase”。下列待审记录是发布前验收快照，线上发布结果完成后单独记录。域名、DNS与权限变更仍不在本次范围。

## 2026-10-12 整改验收：本地待审，尚未发布

本轮对应用户的可靠性、证据、NCCL、部署一致性及**整个页面手机适配**要求。保留 React 18 / TypeScript / Vite / Three.js / R3F / Drei / Zustand 和现有绿色视觉样式。无新增依赖、账号系统、后台或部署工作流。

本地分支：`fix/explorer-reliability-review`；起点及读取到的远端 `main`：`f7a04ec5a1582a20dc0b8f400d6fe0ddb6a6d9e3`。以下修改尚在工作区，未提交、未推送、未发布。没有修改云端权限、域名或 DNS。用户本轮第“一、5”条要求发布前确认，优先于此前会话中的发布授权。

### 问题分类与结果

| 分类 | 事项 | 本轮处理 / 验证范围 |
|---|---|---|
| 复现的问题 P1 | 初始化失败后留空场景、三维按钮和照片遮挡 | 对旧代码在本地禁用 WebGL 复现；新实现以 loading / ready / failed / lost / 2d 状态管理。失败或丢失后 Canvas 卸载，自动显示共享拓扑的组件目录；照片浮层及三维专用按钮隐藏。不是认定所有正常浏览器的旧版三维均损坏。 |
| 复现的问题 P1 | VIS01 按钮写成“打开官方资料” | 本地旧版及 CloudBase 实际页面分别复现。改为第三方报道 / 视觉参考，按钮为“打开视觉参考报道”。 |
| 复现的问题 P1 | 来源无法检索、本地材料无法公开核对 | 增加 ID、标题、机构、关键词与类型搜索、结果数、清空和空结果。无链接材料明确不可公开核对，无伪造下载地址；证据范围逐条显示。 |
| 复现的问题 P1 | Cloudflare 缺失 JS 返回首页 200 | 公网 HTTP 探针复现。本地 Wrangler 配置改为 `not_found_handling: none`，本地模拟验证 JS/CSS/PDF/模型缺失均 404；尚未发布修复。 |
| 复现的问题 P1 | CloudBase 无尾斜杠入口返回相对路径 HTML | HTTP 检查确认无重定向；增加仅针对 `/vera-rubin-nvl72` 的客户端规范化，保留 query/hash。生产构建在本地子路径实测成功。 |
| 复现的问题 P1/P2 | 活动控件状态缺失、关闭按钮名称不匹配 | 导航使用 aria-current，模式/图层使用 aria-pressed；章节使用完整 tabs 语义、方向键和 roving tabindex。关闭按钮跟随专题标题。 |
| 本轮额外发现 | Safari 鼠标打开后焦点回到旧搜索框 | 显式记录打开按钮；背景和下层弹窗 inert；Esc 分层关闭，焦点回到对应打开按钮。 |
| 建议增强 P2 | 分享位置 | hash 保存场景、托盘、组件、专题和离散教学状态；复制链接，新窗口、刷新、前进/后退恢复。默认静态，不写相机或动画每帧。 |
| 建议增强 P1/P2 | 全页手机布局 | 390/768 下导航、详情可收起并定位；详情内可关闭。数量两列、控件换行、专题自动滚到选中项，表格独立横滚，架构图可单独放大。手机三维控件触控区域扩大。 |
| 已有功能回归 | GPU-72 查询 / 托盘18 | 正常、失败、重试后保留正确选择。整柜和当前托盘数量分开显示，避免在托盘页误读72/36为单托盘数量。 |
| 已有功能回归 | 默认六 rank 环归约 | 原算法与默认输入未发现计算错误，保留默认结果。新增来源 rank 跟踪、独立输入及前后轮次测试。 |
| 已有功能回归 | 安全边界 | 保留硬件能力与软件部署组合的区分；Vera CCA/RME/C2C 能力不因跨 Realm 软件组合未证实而降为纯概念。保留 NCCL、IMEX、Sentry 各自职责和解密/旁路/延迟边界。 |

### 主要修改与数据约定

- `ScenePanel`、`SceneCanvas`、`useRenderer`、`renderer-state`：有界显式重试、代次隔离、上下文事件清理、按可见性暂停、二维目录共享拓扑。加载态也可立即选择二维；连续重试不并行建立多个渲染器。
- `research/hardware-counts.json` 为计数来源；生成目录、拓扑、总览、三维和托盘说明复用。新增计数对象、平台、范围、日期、来源；CX9 的每托盘8逻辑端点、2张I/O卡、8个软件接口独立记录。芯片/外部连接器映射仍待核实，未将144逻辑端点改成卡数。
- `research/measurements.json` 为逐值观察记录：3/3.6 TB/s、216/260 TB/s、19.2/22 TB/s分别关联来源；1580 TB/s保留为用户提供的历史引用，不能冒称已复现的官方当前规格。发布日已取得的博客记录具体日期；动态页无修订号时写未知。版本和平台对应关系未确定前，不宣称已经证实同配置矛盾，也不选最大值覆盖其他值。
- `source-metadata`、`EvidenceDetails`、`ResearchModal`：厂商、标准、源码、第三方、用户材料及视觉用途分别标识；编号打开证据卡，独立箭头保留原文链接。`SOURCES.md`同步登记类别及逐条核对日期，未将未复核来源批量标成本日复核。
- `link-semantics`：Astra/带外/信任边为控制虚线；管理边不进入载荷粒子；PCIe控制用途也不混入计算数据筛选。保留SW01–SW36逻辑集合说明，不增加假想物理端口。
- `ring`、`inference-state`、`useInferencePlayback`：动画包、数值矩阵和说明共用快照。每分片记录累计来源，只有集齐6个来源才显示完成。单个可取消时钟驱动播放；人工操作才播报阶段，不持续播报自动播放。
- `exploration-url`、`useExplorationUrl`：安全解析 hash、离散历史和静态恢复；无效参数回退。两个部署使用相同相对路径产物，无需跨应用 SPA 回退。
- `Tabs`、`useDialogOpener`、`styles.css`：键盘状态、焦点及响应式布局；图内横滚不等于整页横向溢出。
- `build-info`：产物附 Git 起点、dirty 标志、源码 SHA-256、构建时间和 Node 版本。工作区尚未提交时明确标记dirty，不伪装成已发布的精确commit。

完整文件列表见 [changed-files.txt](docs/review/changed-files.txt)。数据生成文件由脚本更新，勿仅修改生成 JSON 后跳过数据源。

### 实际执行的检查

| 检查 | 结果 / 实际证据 |
|---|---|
| `npm run data:generate` | 428实体、783逻辑连接、861逻辑端口；生成规格和来源分类。 |
| `npm run typecheck` | 通过。 |
| `npm test` | **30/30通过**，原20项加本次直接相关10项；日志见 [local-tests.log](docs/review/local-tests.log)。 |
| 默认 NCCL 数值 | 第5轮AllGather后每个rank为 `[21,42,63,84,105,126]`；原始输入不被修改。 |
| 独立输入 `100r+k` | 规范输出rank k的RS分片为`1500+6k`；AG所有rank为`[1500,1506,1512,1518,1524,1530]`。 |
| RS所有权说明 | 内部演示rank r持有C(r+1)%6；映射规范输出rank k时读取演示rank(k+5)%6的Ck。没有为迎合断言误改算法。 |
| 来源rank跟踪 | 两组输入的每一轮每个分片等于其来源之和；无重复来源、无提前标记完成。 |
| 播放单时钟 | 独立调度器测试重复启动、暂停、旧回调、取消；UI实测播放/暂停、复位、上一步再单步及OS/Realm切换保留轮次。 |
| 页面后台 | Safari真实切换标签页，后台71,027ms时游标仍`4/1/0`，返回后可恢复；离开NCCL场景由状态和effect停止时钟。 |
| `npm run build` | Node24.21.0复跑通过，TypeScript及Vite完成；有一个数据chunk超过1100kB的大小提示，非构建错误。未通过改阈值隐藏提示。 |
| lint | **未运行：原项目没有lint脚本/配置**，未引入大型工具链制造虚假通过项。 |
| 生产静态资源 | `node scripts/check-build.mjs`：根目录及子路径各13个文件的HTTP、MIME、字节一致性；每入口5类缺失资源404；canonical guard保持query/hash且不影响其他路径；QA故障工具从生产JS移除。[build-check.json](docs/review/build-check.json) |
| Wrangler本地模拟 | 首页及build-info为200；缺失JS/CSS/PDF/GLB为404；见 [wrangler-local-check.json](docs/review/wrangler-local-check.json)。只启动`wrangler dev --local`，未执行发布。 |
| 正常WebGL | Safari实际渲染，拖动后方向变化，托盘展开、视角重置及NVLink图层开关可操作。 |
| 初始化失败 | 本地开发验收注入getContext返回null；状态failed、Canvas数量0，二维可搜索；解除注入并重试恢复ready、Canvas数量1。 |
| 上下文丢失 | 实际调用浏览器`WEBGL_lose_context`扩展；状态lost、Canvas数量0；GPU72/托盘18选择在重试后保留。未将合成事件冒称驱动事件。 |
| 搜索与证据 | GPU-72定位成功、无组件结果有提示；VIS01搜索1条且第三方视觉类型；HW90明确未公开；不存在来源为0条；冲突筛选4条，216/260的逐值来源、双向范围及日期可展开。 |
| 键盘及弹窗 | Shift+Tab从关闭按钮到最后可聚焦元素、Tab回环；方向键切换专题章节；Esc及鼠标触发后的焦点恢复；嵌套证据关闭后先回到专题来源按钮，再关闭专题回到打开按钮。 |
| 四档宽度 | Safari内嵌真实390/768/1280/1440 CSS像素视口；文档scrollWidth分别373/751/1263/1423（差17为滚动条），均未出现整页横溢出。390下专题、证据表、NCCL表及单独图示放大均检查。 |
| 分享链接 | 实际复制按钮成功，新标签打开GPU72/托盘18且动画关闭；生产子路径不带斜杠自动规范化；前进、后退、刷新恢复对应选择。 |
| 安全边界回归 | 原AES-GCM教学、OpenShell策略及拓扑边界单元测试保留；不将教学测试作为真实设备支持证据。 |

响应式验收为Safari桌面引擎中的指定视口，并非实体iPhone/Android的触屏、软键盘、浏览器工具栏、安全区或性能认证。屏幕阅读器朗读未实听；已检查语义、焦点和手动播报触发。没有进行长时间GPU显存/堆快照压力测量，**不据此声称已经证明有或没有内存泄漏**。挂载清理通过代码检查、时钟单测及丢失/重试Canvas数量实测覆盖，驱动级资源回收仍有验证边界。

### 修改前后真实截图

截图是Safari实际UI；包含外链官方图的缩略呈现，不提供可独立使用的官方原图。带浅色外框的画面来自本地视口验收宿主页；底部诊断条仅开发环境存在，不进入线上构建。

| 事项 | 修改前 | 修改后 |
|---|---|---|
| WebGL失败降级 | [旧版失败](docs/review/screenshots/before-webgl-failure.png) | [新版初始化失败](docs/review/screenshots/after-init-failure.png)、[真实上下文丢失](docs/review/screenshots/after-context-loss.png) |
| 视觉参考分类 | [旧版来源](docs/review/screenshots/before-source-classification.png)、[CloudBase独立复现](docs/review/screenshots/cloudbase-before-source.png) | [VIS01修正](docs/review/screenshots/after-source-classification.png) |
| 手机布局 | 本轮未补造修改前手机截图 | [390整柜](docs/review/screenshots/after-390-overview.png)、[390降级](docs/review/screenshots/after-390.png)、[可收起详情](docs/review/screenshots/after-390-details.png)、[手机NCCL](docs/review/screenshots/after-390-nccl.png)、[图示放大](docs/review/screenshots/after-390-diagram-zoom.png)、[规格表](docs/review/screenshots/after-390-evidence-table.png)、[冲突证据](docs/review/screenshots/after-390-conflict.png) |
| 其他宽度及三维 | — | [768](docs/review/screenshots/after-768.png)、[1280](docs/review/screenshots/after-1280.png)、[1440](docs/review/screenshots/after-1440-ready.png)、[生产子路径托盘](docs/review/screenshots/after-production-tray.png) |
| NCCL | 原默认数值已正确 | [AllGather第5轮](docs/review/screenshots/after-nccl-round5.png) |

截图是不同验收步骤的现场记录，部分早于最后的焦点、触控尺寸和计数文字微调；不把每张截图伪装为完全相同构建时刻。

### 两处部署、源码和版本关系

| 项目 | Cloudflare | CloudBase |
|---|---|---|
| 来源 | 本地同一项目，手动Wrangler静态资源发布 | GitHub `xuxiangyi-washu/vera-rubin-nvl72`，`main`，用户控制台更新 |
| 构建 | `npm run build`，输出`dist/` | 已有设置React、Node24、`npm ci`、`npm run build`、`./dist` |
| 应用前缀 | `/` | `/vera-rubin-nvl72/` |
| 当前已知云版本 | `b54fd233-311e-4c79-b47f-4e709ec03918`，只读CLI复核 | 本次Sentry版本的提供方版本号未读取 |
| 本轮HTTP观察 | 入口200；缺失JS错误返回首页200 | 入口HTTP可取；缺失JS404；浏览器初次有中间页 |
| 本轮线上整改 | **未发布** | **未发布 / 未触发更新** |

两个入口当前返回HTML的SHA-256同为`7400e9bedcfecd9059b386624cb9db44dcb244bed3b4930b162b87d3a03cee33`，引用相同的入口JS/CSS文件名；记录见 [deployment-before.json](docs/review/deployment-before.json)。这证明观察到的入口产物一致，**不证明两平台精确Git commit相同**。旧产物无build-info，当前在线版本到精确commit的绑定未知；不能用本地HEAD代替云端版本证据。历史发布记录保存于下文及research，不被本轮本地产物覆盖。

CloudBase首次浏览器访问复现[平台中间页](docs/review/screenshots/cloudbase-platform-interstitial.png)。本轮没有点击“确定访问”、改Cookie或用前端绕过。后续同一浏览器已经显示应用，因此进一步独立检查并复现了VIS01分类问题；未推断中间页为何消失，也未将其他本地故障注入测试自动算作CloudBase线上通过。风险页不属于本应用。

### 仍待验证或处理

1. 这次整改尚未在两平台上线；云端CI构建、部署状态、最终版本及新功能线上独立验收均待确认后执行。
2. CloudBase域名中间页仍是平台机制。本地代码不能移除；条件与待确认步骤见 [部署说明](docs/DEPLOYMENT.md#自定义域名的前置条件待用户确认)。
3. CX9卡/芯片/连接器的真实映射、NVLink ASIC端口及lane配置、具体跨Realm NCCL/IMEX/驱动组合保持待核实。
4. 真实手机、屏幕阅读器朗读、长时内存压力与多浏览器兼容性未验收；外链官方图片仍依赖外部网络。
5. 49页PDF沿用2026-10-10手册，附件下载资源校验正常；本轮没有重新排版PDF，新增分享/降级/手机操作以本报告及README为准。
6. 数据chunk仍有构建体积提示；本轮未引入额外依赖或进行整个项目重构。

### 获准发布后的步骤

1. 先复核远端main和现有CloudBase触发策略，再将这次待审分支提交并合并到main；此时的GitHub推送也属于需确认的发布动作，避免意外触发CI。
2. 用Node24在该确定commit执行安装、测试、构建；保留build-info与文件清单。Cloudflare上传该dist；CloudBase在同一commit、同一锁文件与构建命令生成并部署到现有子路径。绝不以一边成功推断另一边成功。
3. 分别读取Cloudflare部署ID和CloudBase任务/版本号；分别验证build-info.commit与源码指纹，逐文件HTTP/MIME/SHA-256、缺失资源404、带/不带尾斜杠、动态分块、PDF、深链接及真实浏览器交互。build-info.builtAt可不同，源码commit/hash应对应同一源码。
4. 新版本线上验证未通过时分别停止该平台验收并报告原因；保留各平台既有版本标识以供用户决定回滚。域名/DNS/权限不包含在这次代码发布中，需另行确认。

---

## 2026-10-10 历史交付记录（不是本轮整改的线上验收）

核验日期：2026-10-10。本项目区分公开事实、教学模型、实际浏览器操作和真实硬件测试。

## 可复现检查

| 项目 | 结果与证据 |
|---|---|
| 依赖与运行 | React18 / TypeScript / Vite8；锁文件；Node26.3.1、npm11.16.0 |
| TypeScript与生产构建 | `npm run build`通过，产物为dist；大小明细见research/build-manifest.json |
| 自动测试 | `npm test`，20项：10项拓扑/来源，3项Ring数值，3项AEAD正确性、4项策略教学语义 |
| 数据规模 | 428实体、783逻辑连接、861逻辑端口、27模型类别、81条模型级规格、59条来源 |
| 官方图片 | 22个官方外链；public/assets/official仅清单与说明，无官方原图文件 |
| 开发预览 | 本次使用127.0.0.1:5174；未中断用户已占用的5173 |
| Cloudflare公开访问 | 地址见下文；逐文件HTTP和SHA-256检查见research/cloudflare-deployment.json |
| PDF手册 | 49页、20张真实UI截图、自绘结构图、可点击目录/来源、QR；逐页渲染检查 |
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

## CloudBase子路径发布核验

2026-10-10：修正Vite相对base和PDF链接，增加Node24配置；20项测试和生产构建通过。验证`/vera-rubin-nvl72/`中的入口JS/CSS与PDF相对路径正确。CloudBase版本002发布成功，11个远端文件全部HTTP200、MIME正确且SHA-256匹配本地；详见`research/cloudbase-deployment.json`。

## Sentry深入研究更新

研究锁定OpenShell v0.1.3提交e1f3c82caa3ed3b65de22889ae7ef32a774878ef，并记录main快照。新增13条来源；8个章节区分厂商架构声明、源码事实与工程推论。新增4项有语义的回归测试：允许读取、audit/enforce差异、audit仍拒绝网络/凭证不匹配、未知输入不误放行。总计20项测试通过。

PDF更新Sentry章节、双域架构实图，并新增请求实验实图，现为49页与20张真实UI截图。渲染核对新增/变化页面和来源索引，旧章节内容沿用已验收版本。未执行真实OpenShell、SMT或Sentry程序。
