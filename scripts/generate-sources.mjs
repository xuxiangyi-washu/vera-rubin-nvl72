import fs from 'node:fs';
const sourceOrigins=[...JSON.parse(fs.readFileSync('research/hardware-sources.json')),...JSON.parse(fs.readFileSync('research/security-sources.json')),...JSON.parse(fs.readFileSync('research/visual-sources.json')),...JSON.parse(fs.readFileSync('research/communication-sources.json'))];
const sources=JSON.parse(fs.readFileSync('src/data/sources.json')).map(s=>({...s,...sourceOrigins.find(original=>original.id===s.id)})),images=JSON.parse(fs.readFileSync('research/official-assets.json'));
let text=`# Vera Rubin NVL72 来源与素材登记\n\n核验日期：2026-10-10。${sources.length} 条事实来源记录（包含用户输入与本地材料）；${images.length} 条 NVIDIA 官方图片外链。来源注册表为 src/data/sources.json，事实与 ID 的关联为 src/data/catalog.json 及 data/nvl72-topology.json。\n\n## 使用规则\n\n优先读取本地 A、B、C 再用官方资料交叉核验。硬件配置采用 DGX VR 公开实例，不能把参考规格泛化为所有 OEM 出货规格。当前产品表与有日期博客冲突时并列，不任选最大值。文档 A 按章节引用，未渲染页码；B/C 按实际 PDF 页码。原始文件保留在 Downloads/集群，项目不复制用户文档全文。\n\n“已确认”表示原始公开资料支持，不表示实测或在所有软件/SKU上均启用；“冲突”保留不同官方口径；“待核实”表示本次材料不能证实。协议通用标准不能替代 Vera Rubin 的产品支持矩阵。\n\n## 事实来源清单\n\n`;
for(const s of sources){
 text+=`### ${s.id} · ${s.title}\n\n`;
 text+=s.url?`原始资料：[${s.title}](${s.url})\n\n`:`本地/用户材料：${s.path??s.file??'用户在本轮消息给出的规格说明'}\n\n`;
 text+=`定位：${s.section??'见原文'}。状态：${s.confidence??'已确认'}。\n\n`;
 if(s.claims)text+=s.claims.map(c=>`- ${c}`).join('\n')+'\n\n';
}
text+=`## 图片素材与再分发边界\n\n未查获能明确授权本项目再分发的图片许可，因此所有官方图片只通过原始 HTTPS 地址外链。UI 显示“图片来自 NVIDIA 官方，版权归 NVIDIA 所有”和 © NVIDIA Corporation。图片加载失败时仍有原图入口。public/assets/official 只存外链清单与说明，不包含图片二进制。\n\n本项目未找到并采用可明确再分发的官方 GLB/GLTF/STEP。全部 3D 网格、材质、图例均为本项目参数化代码，不冒充官方 CAD，不使用 AI 生成图。无需下载额外模型才能运行七个视图。未使用位图纹理，纹理压缩不适用。\n\n| ID | 图像 | 原始文件名 | 官方原图 | 来源页 | 许可处理 |\n|---|---|---|---|---|---|\n`;
for(const i of images)text+=`| ${i.id} | ${i.label} | ${i.originalFilename} | [原图](${i.url}) | [来源](${i.sourcePage}) | © NVIDIA；仅外链；不再分发 |\n`;
text+=`\n## 真实UI截图\n\n按用户要求，使用说明PDF包含本项目的19张真实Safari界面截图，原始截图位于docs/screenshots。截图为操作说明，部分含NVIDIA图片的缩略呈现，版权归NVIDIA；没有提供可独立使用的官方原图文件。截图说明与对应来源记录见PDF第23章。界面、参数化几何和解释图由本项目实现。\n\n## 软件与图标\n\n界面图标使用 lucide-react（ISC；见 node_modules/lucide-react/LICENSE）。React、Vite、Three.js、React Three Fiber、Drei、Zustand、TypeScript、Ajv 的许可按各依赖包 LICENSE 与锁文件登记。界面使用系统字体，不打包或远程加载字体文件。\n\n构建依据：[Vite 官方入门](https://vite.dev/guide/)；渲染性能依据：[React Three Fiber scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)。项目采用实例化、LOD、按需渲染及自适应 DPR；动画是结构解释，不是网络实测。\n`;
fs.writeFileSync('SOURCES.md',text);
fs.writeFileSync('public/assets/official/manifest.json',JSON.stringify(images,null,2));
fs.writeFileSync('public/assets/official/README.md','# 官方素材外链\n\n本目录只记录 NVIDIA 官方图片地址，不打包图片。manifest.json 保留原文件名、原图 URL、来源页与版权。图片来自 NVIDIA 官方，版权归 NVIDIA 所有。许可未核实，不再分发。\n');
