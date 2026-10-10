import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
const read=path=>JSON.parse(fs.readFileSync(new URL(`../${path}`,import.meta.url)));
const data=read('data/nvl72-topology.json'),schema=read('data/nvl72-topology.schema.json'),catalog=read('src/data/catalog.json');
const entityMap=new Map(data.entities.map(e=>[e.id,e])),portMap=new Map(data.ports.map(p=>[p.id,p])),linkMap=new Map(data.links.map(l=>[l.id,l])),sourceIds=new Set(read('src/data/sources.json').map(s=>s.id));

test('拓扑遵循 JSON Schema 2020-12',()=>{const validate=new Ajv2020({strict:true}).compile(schema);assert.ok(validate(data),JSON.stringify(validate.errors));});
test('整柜硬件总量与每托盘构成一致',()=>{
 for(const [type,count] of Object.entries({compute:18,superchip:36,gpu:72,cpu:36,nic:144,dpu:18,switchTray:9,switch:36,cartridge:4,power:4}))assert.equal(data.entities.filter(e=>e.type===type).length,count,type);
 for(let t=0;t<18;t++)for(const [type,count] of Object.entries({gpu:4,cpu:2,nic:8,dpu:1}))assert.equal(data.entities.filter(e=>e.trayIndex===t&&e.type===type).length,count,`托盘${t+1}:${type}`);
});
test('实体 ID、父子、逻辑端口和链接引用完整',()=>{
 assert.equal(entityMap.size,data.entities.length);assert.equal(linkMap.size,data.links.length);assert.equal(portMap.size,data.ports.length);
 for(const e of data.entities){if(e.parent)assert.ok(entityMap.get(e.parent)?.children.includes(e.id));for(const child of e.children)assert.equal(entityMap.get(child)?.parent,e.id);for(const id of e.links)assert.ok(linkMap.has(id));for(const id of e.ports)assert.equal(portMap.get(id)?.entity,e.id)}
 for(const l of data.links){assert.ok(entityMap.has(l.source));assert.ok(entityMap.has(l.target));assert.equal(portMap.get(l.sourcePort)?.entity,l.source);assert.equal(portMap.get(l.targetPort)?.entity,l.target)}
 for(const d of data.security_domains)for(const id of d.members)assert.ok(entityMap.has(id));
});
test('关键规格、实体与链接都有可解析证据',()=>{
 const check=ids=>{assert.ok(ids.length);for(const id of ids)assert.ok(sourceIds.has(id),id)};
 for(const e of data.entities){check(e.source);for(const s of e.specs)check(s.source)}
 for(const l of data.links)check(l.evidence);
 for(const m of Object.values(catalog))check(m.source);
});
test('每个 DPU 控制本托盘 8 端点，不跨租户主机猜接线',()=>{
 for(const d of data.entities.filter(e=>e.type==='dpu')){
  const nics=data.links.filter(l=>l.type==='astra'&&l.source===d.id).map(l=>entityMap.get(l.target));
  assert.equal(nics.length,8);assert.equal(new Set(nics.map(n=>n.id)).size,8);assert.ok(nics.every(n=>n.type==='nic'&&n.trayIndex===d.trayIndex));
 }
});
test('NVLink 逻辑 fabric 可达全部 72 GPU，未伪造直接 GPU-交换芯片接线',()=>{
 const links=data.links.filter(l=>l.type==='nvlink'),seen=new Set(['gpu-01']),queue=['gpu-01'];
 while(queue.length){const current=queue.shift();for(const l of links){const next=l.source===current?l.target:l.target===current?l.source:null;if(next&&!seen.has(next)){seen.add(next);queue.push(next)}}}
 assert.equal(data.entities.filter(e=>e.type==='gpu'&&seen.has(e.id)).length,72);
 assert.equal(data.entities.filter(e=>e.type==='switch'&&seen.has(e.id)).length,36);
 assert.ok(links.every(l=>l.physicalLaneCount===null));
 assert.ok(!links.some(l=>entityMap.get(l.source).type==='gpu'&&entityMap.get(l.target).type==='switch'));
});
test('C2C 仅连接同一 Superchip，1.8TB/s不重复视为单边独享',()=>{
 const links=data.links.filter(l=>l.type==='c2c');assert.equal(links.length,72);
 for(const l of links){assert.equal(entityMap.get(l.source).parent,entityMap.get(l.target).parent);assert.match(l.bandwidth,/Superchip 聚合/)}
});
test('保留已核验纠错及安全边界',()=>{
 assert.match(catalog.gpu.specs.find(s=>s.label==='晶体管').value,/3360/);
 assert.match(catalog.nic.specs.find(s=>s.label==='DGX VR 端点速率').value,/800/);
 assert.match(catalog.nic.specs.find(s=>s.label==='TLS 硬件卸载').value,/不支持/);
 assert.equal(catalog.imex.specs.find(s=>s.label==='Vera Rubin 绑定').confidence,'待核实');
 assert.equal(catalog.gpu.specs.find(s=>s.label==='NVLink 双向').confidence,'冲突');
 assert.match(catalog.power.caveat,/不是机柜实测耗电/);
});
test('没有未经授权再分发的官方图片，外链清单来自官方域',()=>{
 const images=read('research/official-assets.json');assert.ok(images.length>=10);
 for(const image of images){assert.match(new URL(image.url).hostname,/(^|\.)nvidia\.com$/);assert.ok(image.licenseNote.includes('仅外链'));assert.ok(image.originalFilename)}
 const files=fs.readdirSync(new URL('../public/assets/official/',import.meta.url));assert.ok(files.every(f=>f.endsWith('.md')||f.endsWith('.json')));
});

test('机柜分区遵循官方上10计算、中9交换、下8计算及上下各2电源层',()=>{
 const compute=data.entities.filter(e=>e.type==='compute').sort((a,b)=>a.index-b.index);
 const switches=data.entities.filter(e=>e.type==='switchTray');
 const upper=compute.slice(0,10),lower=compute.slice(10);
 assert.equal(lower.length,8);
 assert.ok(Math.min(...upper.map(e=>e.position[1]))>Math.max(...switches.map(e=>e.position[1])));
 assert.ok(Math.max(...lower.map(e=>e.position[1]))<Math.min(...switches.map(e=>e.position[1])));
 const power=data.entities.filter(e=>e.type==='power');
 assert.equal(power.filter(e=>e.position[1]>Math.max(...upper.map(e=>e.position[1]))).length,2);
 assert.equal(power.filter(e=>e.position[1]<Math.min(...lower.map(e=>e.position[1]))).length,2);
 const images=read('research/official-assets.json');const imageUrls=new Set(images.map(i=>i.url));
 for(const entity of data.entities)if(entity.image)assert.ok(imageUrls.has(entity.image));
});
