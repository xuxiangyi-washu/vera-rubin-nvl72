# Vera Rubin NVL72 完整交付索引

完整可运行源码和技术资料位于本项目，按请求的十项顺序组织如下。

1. **资料调研摘要表**：[硬件研究](docs/HARDWARE.md#资料调研摘要表)，并以[安全研究](docs/SECURITY.md)补充软件与信任机制。
2. **架构与连接关系**：[硬件架构的网络、数据面和控制面](docs/HARDWARE.md#网络数据面控制面)；所有示意连接的语义见[数据模型](docs/DATA_MODEL.md#连接建模)。
3. **硬件数量与三级网络**：[数量清单](docs/HARDWARE.md#数量清单)及紧随其后的网络章节。18计算托盘、9交换托盘、72GPU、36CPU、144CX9端点、18DPU、36交换ASIC。
4. **JSON Schema与示例**：[完整Schema](data/nvl72-topology.schema.json)、[完整428实体拓扑](data/nvl72-topology.json)、[GPU示例](data/example-gpu.json)、[类型与语义](docs/DATA_MODEL.md)。
5. **3D前端完整源码**：[应用入口](src/App.tsx)、[整柜](src/scenes/RackScene.tsx)、[计算托盘](src/scenes/TrayScene.tsx)、[交换fabric](src/scenes/FabricScene.tsx)、[网络](src/scenes/NetworkScene.tsx)、[机密计算与信任链](src/scenes/SecurityScene.tsx)。其他组件、状态、数据、样式及依赖均已包含，不是仅有代码片段。
6. **文件树与运行**：[README](README.md)。运行`npm install && npm run dev`；构建`npm run build`；自检`npm test`。Node要求`^20.19.0 || >=22.12.0`。
7. **五个安全专题**：[SECURITY.md](docs/SECURITY.md)包括Astra、Argus/Sentry、Realm、SPDM/TDISP/IDE及IMEX，并分别标注官方证据、工程解释和未披露实现。
8. **SOURCES.md内容**：[完整来源与素材许可登记](SOURCES.md)，46条事实来源记录、22张官方图片外链；未打包官方原图。
9. **VERIFICATION.md内容**：[完整核验记录](VERIFICATION.md)，构建、16项测试、HTTP资源检查与Safari观察范围。
10. **自检与待核实清单**：[核验文件中的交付覆盖和待核实清单](VERIFICATION.md#待核实清单)。本项目不伪造实机遥测、真实证明或未公开的物理布线。

关键纠正已进入源码和文档：3360亿晶体管、800Gb/s/CX9端点、C2C聚合口径、DOCA3.5.0对本机架CX9 TLS硬件卸载的限制。带宽冲突同时保留，来源可直接打开。

公开网站：https://vera-rubin-nvl72.xuxiangyi666.workers.dev/ 。已增加官方产品图浏览、写实材质、13个图文专题、NCCL多域推理动画和通用AEAD交互实验。

使用说明PDF：`output/pdf/NVL72-架构探索器-使用说明.pdf`，47页、19张真实UI截图、可点击来源和目录。网站顶部可下载同版PDF。工作群介绍：`docs/WORKGROUP_INTRO.txt`。
