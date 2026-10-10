# Vera Rubin NVL72 数据模型与连接语义

完整规范：[`../data/nvl72-topology.schema.json`](../data/nvl72-topology.schema.json)，JSON Schema Draft 2020-12。完整数据：[`../data/nvl72-topology.json`](../data/nvl72-topology.json)。具体实例：[`../data/example-gpu.json`](../data/example-gpu.json)。TypeScript 类型：[`../src/models/types.ts`](../src/models/types.ts)。

## 顶层字段

| 字段 | 内容 | 语义 |
|---|---|---|
| metadata | 标题、核验日期、版本、限制与纠错 | 不是实时设备发现结果 |
| rack | rack-01 | 本机架根实体 ID |
| entities | 428 个实体 | rack、tray、superchip/node、chip、基础设施、逻辑服务等统一表达 |
| ports | 861 个逻辑汇聚端口 | physicalCount 为 null 表示未核实实际端口/lane数 |
| links | 783 条功能连接 | 不代表电气原理图上的一条线或全部独立物理链路 |
| networks | Scale-Up、Scale-Out、Scale-In、OOB | 描述职责与可视化分类 |
| security_domains | 租户、基础设施、agent 治理 | 表示责任边界，不宣称全部成员共享密钥或已加入同一证明组 |

Entity 字段包含 `id/name/type/model/vendor/specs/functions/image/source/position/rotation/size/ports/links/parent/children`。型号规格从 catalog 生成并写入导出 JSON，每个 Fact 包含 `label/value/confidence/source/note?`。`source` 使用 SOURCES.md 中的稳定编号。软件、服务节点的 `count` 不是芯片数量。

`position/rotation/size` 为设计空间参数；不表示机械尺寸。完整 JSON 中的机架坐标用于整柜模型，其他视图对相同 ID 应用不同布局。`image` 保存该实体的官方图片外链，缺失时为null；22张官方图片在素材清单中独立管理，不把图片二进制写入项目。

## 核心 Schema 摘要

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["metadata", "rack", "entities", "ports", "links", "networks", "security_domains"],
  "$defs": {
    "confidence": { "enum": ["已确认", "待核实", "冲突"] },
    "fact": {
      "type": "object",
      "required": ["label", "value", "confidence", "source"]
    }
  }
}
```

上面是阅读摘要，实际验证使用完整 schema 文件，覆盖所有必填字段、枚举、向量维度、属性约束和链接结构。

## GPU 示例

```json
{
  "id": "gpu-01",
  "name": "Rubin GPU 01",
  "type": "gpu",
  "model": "NVIDIA Rubin GPU",
  "vendor": "NVIDIA",
  "parent": "superchip-01",
  "trayIndex": 0,
  "source": ["HW03", "HW05", "SEC11"],
  "specs": [
    {"label":"晶体管", "value":"3360 亿（336 billion）", "confidence":"已确认", "source":["HW05"]},
    {"label":"NVLink 双向", "value":"3.0 / 3.6 TB/s", "confidence":"冲突", "source":["HW03","HW07"]}
  ]
}
```

这是字段选段；完整 entity、端口和连接见 example-gpu.json。对话中的“336 亿”已纠正。

## 连接建模

1. 每 GPU 只有一条到 `spine` 的**逻辑汇聚** NVLink 边，36 个 switch 也连接到此汇聚节点。任意两个 GPU 在该逻辑图中可达，不能由此判断物理邻接 ASIC 或单链路数量。一次通信不依次经过全部 36 颗 ASIC。
2. NVLink-C2C 按同 Superchip 的 CPU→两 GPU 表达；每条边注明 1.8 TB/s 是 Superchip 聚合共享口径，不能把两边相加为 3.6 TB/s。
3. 主机→四端点 SuperNIC 板组的 PCIe 关系有架构依据，但端点路由、lane 分配与是否经过 PCIe switch 未核实，因此边标“待核实”。不画已确认的 GPU→DPU 物理 PCIe 直连。
4. DPU→八 ConnectX-9 的 Astra 边是专用控制连接；协议和密钥机制未知，不自行标为 TLS/SPDM/IDE。
5. ConnectX-9→外部网络是单端点 800 Gb/s 的 DGX VR 口径。外部交换节点为汇聚占位；三机柜画面中对端 A/B 为示意对象，不进入本机架72 GPU清单。
6. BMC→管理网络1GbE有官方依据；BMC→HMC→DPU只是管理关联，标待核实，不称为实际认证顺序。
7. 电力与液冷边表示托盘盲插与分配关系。供电额定值不能用于计算动画粒子速度或推断实时功耗。
8. 信任依赖边不编码可执行握手。设备认证、接口授权、IDE就绪和机密DMA使能有依赖关系；缺少条件时不能默认为部署成功。

## 修改数据

修改 `scripts/generate-topology.mjs` 中的事实和结构，必要时同步 `research/*-sources.json`，运行：

```bash
npm run data:generate
npm test
npm run build
```

来源索引必须可解析；回归检查会检测数量、断引用、错误父子关系、越托盘的 Astra 连接和误标端点速率。
