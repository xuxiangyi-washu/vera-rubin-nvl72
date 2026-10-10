# NVIDIA Vera Rubin NVL72 架构探索器

基于 React 18、TypeScript、Vite、Three.js、React Three Fiber、Drei、Zustand 的中文 3D 前端。包含整柜、计算托盘、NVLink 交换网络、三级网络、机密计算、信任链、NCCL推理动画七个视图。代码、事实数据和来源均在本目录，可独立本地运行。

这是**结构与数据流教学仿真**，不是实机数字孪生、设备管理后台或性能/密码协议模拟器。粒子、路径、颜色和几何位置是示意；未连接真实遥测、告警或证明服务。事实核验日期为 **2026-10-10**。

## 线上访问与更新

公开网址：**https://vera-rubin-nvl72.xuxiangyi666.workers.dev/**

托管于用户自己的 Cloudflare Workers 账户，使用静态资源部署。配置为 `wrangler.jsonc`，只上传 `dist/`。更新源码后运行：

```bash
npm run deploy
```

首次在新电脑部署时，先运行 `npx wrangler login --device` 完成 Cloudflare 账户授权。详细过程见 [Cloudflare部署记录](docs/DEPLOYMENT.md)。

## 官方图片与写实模式

计算托盘已按 NVIDIA 官方图调整黑色冷板、金属壳体、内部管路、SOCAMM插槽和前部把手。机柜按上10计算、中9交换、下8计算、上下各2电源层排列；不把参数化尺寸当作机械CAD。

场景右上角“官方外观参考”以及详情里的产品图可打开大图模式。可在计算托盘、GPU、CPU、ConnectX-9、BlueField-4与交换托盘之间切换，查看整体、俯视和前视并放大。工具栏“官方产品图”切换照片与3D，“写实材质”切换材质表达。22张图片均从NVIDIA官方站点外链加载；需要网络，并保留原始出处与首发规格说明。

## 安装与运行

Node.js `^20.19.0 || >=22.12.0`。本次使用 Node 26.3.1、npm 11.16.0。Vite 8 的运行时要求见 [官方入门](https://vite.dev/guide/)。

```bash
cd /Users/xiangyixu/Documents/nvl72
npm install
npm run dev
```

访问终端输出的 `http://127.0.0.1:5173/`。项目只监听本机回环地址；5173占用时会明确退出，可运行 `npm run dev -- --port 5174`。

```bash
npm test
npm run build
npm run preview
```

锁文件已提供；重新获取项目后也可用 `npm ci`。构建输出在 `dist/`。无需 API key、服务器数据库、NVIDIA硬件或官方模型下载。模型与证据数据本地可用；官方图片及来源链接需要网络。

## 使用

- 七个视图在左侧切换。拖动旋转、滚轮缩放、右键平移；触屏使用双指缩放/平移。右上工具可重置视角、切换后视图、展开结构、显示标签。
- 在整柜中点击计算托盘进入内部，点击交换托盘进入 fabric。托盘视图用左右按钮遍历18个托盘。
- 点击任意芯片或从目录选择实体，右侧展示型号、数量、规格、功能、连接、来源与公开边界。搜索支持 `gpu-72`、`GPU 72`、`tray-18`、`cx9-144`、`dpu-18`、`Astra` 等；`/` 聚焦搜索。
- NVLink视图显示全部72 GPU及36 ASIC，选中GPU可查看逻辑路径，切换全部拓扑。虚线表示候选交换集合，不承诺已核实的物理端口映射。SHARP路径是教学示意。
- 网络视图可切换 Spectrum-X / Quantum-X800，查看跨机架、存储、Astra与OOB的分工。对端机架、外部交换数量与存储位置是示意。
- 底部图例控制连接类型；过滤器控制模块类型与流动类型。模块过滤适用于整柜、托盘、fabric。GPU/CPU等被隐藏时，必要机架/托盘结构仍保留作空间参照。
- 默认静止，点击“演示流动”开启粒子；使用节能模式限制DPR、粒子与细节。官方原图在“来源与核验 → 官方原图”中，只外链，不打包。
- “导出拓扑”下载完整 JSON。资料库支持按模块、规格、协议、证据状态筛选；来源均可定位到 URL、章节或本地PDF页码。

## 交付阅读顺序

| 顺序 | 交付内容 | 文件 |
|---|---|---|
| 1 | 资料调研摘要表 | [HARDWARE.md](docs/HARDWARE.md)，安全专题补充 [SECURITY.md](docs/SECURITY.md) |
| 2 | Vera Rubin架构与连接 | [HARDWARE.md](docs/HARDWARE.md)“网络、数据面、控制面” |
| 3 | 整柜数量与三级网络 | [HARDWARE.md](docs/HARDWARE.md)“数量清单”及网络章节 |
| 4 | JSON Schema与示例 | [DATA_MODEL.md](docs/DATA_MODEL.md)、[Schema](data/nvl72-topology.schema.json)、[实例](data/example-gpu.json) |
| 5 | 完整前端源码 | `src/`、`scripts/`、`data/`、`package.json`、`package-lock.json` |
| 6 | 文件树、安装与运行 | 本README |
| 7 | Astra / Sentry / Argus / Realm / IMEX | [SECURITY.md](docs/SECURITY.md) |
| 8 | 全部来源与图片许可 | [SOURCES.md](SOURCES.md) |
| 9 | 验证记录与边界 | [VERIFICATION.md](VERIFICATION.md) |
| 10 | 自检与待核实清单 | [VERIFICATION.md](VERIFICATION.md)“交付覆盖”与“待核实” |

## 交互专题与使用手册

网站包含13个图文专题：整柜、计算托盘、NVLink交换、三级网络、Astra、机密计算、Scale-In、Sentry、Open Agent Safety、管理ToR、NVLink-C2C、六芯片平台全景、NVLink链路加密边界。每个专题提供结构图、步骤、来源和未披露项。

NCCL视图使用3个OS域、6个rank/GPU和4个预设token。实际计算教学Ring的Reduce-Scatter/AllGather分块数值；可播放、暂停、单步、选择阶段或速度。Realm模式是目标架构概念示例，尚不能确认该跨Realm软件组合的正式支持。没有调用真实NCCL或大模型。

NVLink加密专题把C2C authenticated encryption和GPU间NVLink encryption的公开证据分开。交互实验实际运行浏览器Web Crypto AES-GCM，展示篡改失败和序号去重；算法与参数仅属于通用示例，不能当成NVLink 6公开实现。

- [PDF使用手册](https://vera-rubin-nvl72.xuxiangyi666.workers.dev/guides/nvl72-user-guide.pdf)：47页，19张真实UI截图与逐图操作说明、自绘架构图、可点击目录、46条来源、访问二维码。
- 本地交付：`output/pdf/NVL72-架构探索器-使用说明.pdf`；网站文件：`public/guides/nvl72-user-guide.pdf`。
- 截图在`docs/screenshots/`，记录在`docs/screenshots/manifest.json`。PDF仅按版面裁切界面，没有修改数值；官方图片缩略呈现的版权归NVIDIA。
- PDF重建：安装ReportLab、pypdf后运行`python scripts/build-user-guide.py`；当前脚本使用macOS系统中的Arial Unicode和STHeiti字体。更换系统需调整脚本中的字体路径，并重新渲染检查。
- [工作群介绍](docs/WORKGROUP_INTRO.txt)：约200字，可连同公开网址直接分享。

## 本地文档与纠错

已实际读取 Downloads/集群中的文档A（DOCX）、文档B（PDF）和文档C（PDF）。A用于构成、连接及密码边界；B用于Vera Rubin规格冲突与软件边界；C用于Sentry身份与agent治理。A以章节引用，没有伪造DOCX页码；B/C保留已核实PDF页码。三份原文不复制到源代码包。

重要修正：336 billion为**3360亿**晶体管；144个CX9端点按当前DGX VR规格为**800 Gb/s/端点**，1.6 Tb/s是每GPU口径；C2C **1.8 TB/s是Superchip聚合**；DOCA3.5.0不支持本配置CX9的TLS硬件卸载。当前产品页HBM为约1400TB/s；1580TB/s旧口径未复现。所有具体证据见 [硬件对照](docs/HARDWARE.md) 与 [来源登记](SOURCES.md)。

不能推断Argus能读取Realm私有内存；NVLink端到端/逐跳加密与交换机密钥角色未披露；IMEX的Vera Rubin具体产品绑定待核实。BMC→HMC→DPU为管理关联示意，不是已确认的密码证明链。[安全专题](docs/SECURITY.md)逐层解释这些边界。

## 文件树

```text
nvl72/
├── src/
│   ├── components/          # 目录、模块详情、资料库
│   ├── scenes/              # 七视图、实例化、连线与粒子
│   ├── models/types.ts      # TypeScript实体、事实及连接类型
│   ├── data/                # 事实catalog、来源注册表
│   ├── hooks/               # 小屏布局检测
│   ├── stores/              # Zustand交互状态
│   ├── utils/               # 颜色、格式、JSON导出
│   ├── assets/              # 自建资源说明，无官方图副本
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── public/assets/official/  # 22张图片外链清单与版权说明
├── public/guides/            # 网站可下载的PDF手册
├── data/
│   ├── nvl72-topology.json
│   ├── nvl72-topology.schema.json
│   └── example-gpu.json
├── research/                # 硬件/安全来源JSON、图片来源JSON
├── scripts/                 # 可重建数据、schema、SOURCES
├── tests/                   # 16项：拓扑、Ring数值、AEAD篡改/重放
├── docs/
│   ├── HARDWARE.md
│   ├── SECURITY.md
│   └── DATA_MODEL.md
├── README.md
├── SOURCES.md
├── VERIFICATION.md
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── package-lock.json
```

## 实现与性能

重复芯片、连接器采用 InstancedMesh，共用几何体。整柜细节用 Drei Detailed 实现距离LOD。暂停时 `frameloop="demand"`；动画开启时连续渲染，页面隐藏时恢复按需。小屏DPR上限1；节能模式减少细节和粒子；PerformanceMonitor可在动画负载较高时降级。Three场景和资料库懒加载。系统字体避免额外字体下载；未使用位图纹理，因此没有虚构“纹理压缩”成果。

没有WebGL时提供提示，模块目录与资料表仍可用。没有跨设备FPS基准，也不保证所有手机维持固定帧率。实现状态和实际验收范围见 VERIFICATION.md。
