// 资料机构和用途按已登记来源分类，不将存在URL视为厂商官方证据。
export function classifySource(source){
 const id=source.id,url=source.url??'';
 const local=!url;
 const standard={SEC12:'Arm',SEC17:'DMTF',SEC18:'PCI-SIG',CR01:'NIST',CR02:'W3C'};
 const kind=local?'user':id==='VIS01'?'third-party':url.includes('github.com/')?'code':standard[id]?'standard':/(^|\.)nvidia\.com$/.test(new URL(url).hostname)?'vendor':'third-party';
 const issuer=local?'用户提供':id==='VIS01'?'StorageReview':standard[id]??(id==='SEC20'?'Arm':id==='SEC22'?'CHIPS Alliance':kind==='third-party'?new URL(url).hostname:'NVIDIA');
 return {kind,issuer,purpose:id==='VIS01'?'visual':'technical',access:local?'unpublished':'public',publishedAt:({HW05:'2026-07-21',HW06:'2026-01-05（页面注明2026-03-16更新）',HW07:'2026-07-20',SEC11:'2026-01-05（页面注明2026-03-16更新）'})[id]??(['HW01','HW02'].includes(id)?'2026-10-07（页面更新）':id.startsWith('SEC')&&Number(id.slice(3))>=23?'2026-10-09（固定v0.1.3提交）':'未知'),checkedAt:['HW01','HW02','HW03','HW05','HW06','HW07','SEC11','SEC01','SEC07','SEC10','NC01','NC02'].includes(id)?'2026-10-12':'2026-10-10（上轮核对）',scopeNote:local?'未提供公开链接。仅能核对书目信息和已记录章节；原文由用户持有，不能充当可公开复核的唯一证据。':id==='VIS01'?'仅作外观视觉参考，不据此证明精确布线、数量、端口映射或性能。':'仅支持原文给定平台、版本和章节范围；不自动扩展为实机或默认部署结果。'};
}
