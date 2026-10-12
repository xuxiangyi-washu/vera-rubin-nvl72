export const linkRoles={nvlink:'GPU数据',c2c:'CPU–GPU一致性数据',pcie:'设备I/O（按该边用途）',scaleout:'机架间计算数据',astra:'配置/策略/监控控制',storage:'存储数据',management:'带外管理',power:'供电',cooling:'冷却',trust:'证明依赖'};
export const controlTypes=new Set(['astra','management','trust']);
export const payloadTypes=new Set(['nvlink','c2c','pcie','scaleout','storage']);
export function payloadLinks(links){return links.filter(l=>payloadTypes.has(l.type)&&['data','storage'].includes(l.flow))}
export function isPayloadPath(path){return payloadTypes.has(path.type)&&(!path.flow||['data','storage'].includes(path.flow))}
export function matchesFlow(path,flow){
 if(flow==='all')return true;
 if(flow==='compute')return ['nvlink','c2c','scaleout','pcie'].includes(path.type)&&isPayloadPath(path);
 if(flow==='control')return controlTypes.has(path.type)||path.flow==='control';
 if(flow==='storage')return path.type==='storage';
 return flow==='infrastructure'&&['power','cooling'].includes(path.type);
}
