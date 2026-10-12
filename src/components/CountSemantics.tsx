import {hardwareCounts as counts} from '../data';
import {SourceButton} from './EvidenceDetails';
export default function CountSemantics(){return <div className="count-semantics"><strong>CX9计数口径 · {counts.platform}</strong><div><span>{counts.tray.nic} 个逻辑端点 <SourceButton id="HW06"/></span><span>{counts.tray.cx9Cards} 张I/O卡 <SourceButton id="HW01"/></span><span>{counts.tray.cx9Interfaces} 个CX9 mlx5接口 <SourceButton id="HW02"/></span></div><p>{counts.cx9Note}</p><small>DGX硬件/网络文档更新：{counts.date}；具体卡、芯片、连接器与软件接口映射待核实。</small></div>}
