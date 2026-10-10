import fs from 'node:fs';
const ref=name=>({$ref:`#/$defs/${name}`}),string={type:'string'},strings={type:'array',items:string},vec={type:'array',items:{type:'number'},minItems:3,maxItems:3};
const sourceIds={type:'array',items:string,minItems:1,uniqueItems:true};
const schema={
 $schema:'https://json-schema.org/draft/2020-12/schema',title:'Vera Rubin NVL72 logical architecture',type:'object',
 required:['metadata','rack','entities','ports','links','networks','security_domains'],additionalProperties:false,
 properties:{metadata:{type:'object',required:['title','asOf','version','disclaimer','corrections'],properties:{title:string,asOf:string,version:string,disclaimer:string,corrections:strings},additionalProperties:false},rack:string,entities:{type:'array',items:ref('entity')},ports:{type:'array',items:ref('port')},links:{type:'array',items:ref('link')},networks:{type:'array',items:{type:'object',required:['id','name','color','scope'],properties:{id:string,name:string,color:string,scope:string},additionalProperties:false}},security_domains:{type:'array',items:{type:'object',required:['id','name','members','note','source'],properties:{id:string,name:string,members:strings,note:string,source:sourceIds},additionalProperties:false}}},
 $defs:{
  confidence:{enum:['已确认','待核实','冲突']},
  fact:{type:'object',required:['label','value','confidence','source'],properties:{label:string,value:string,confidence:ref('confidence'),source:sourceIds,note:string},additionalProperties:false},
  entity:{type:'object',required:['id','name','type','model','vendor','specs','functions','image','source','position','rotation','size','ports','links','parent','children'],properties:{id:string,name:string,type:{enum:Object.keys(JSON.parse(fs.readFileSync('src/data/catalog.json')))},model:string,vendor:string,specs:{type:'array',items:ref('fact')},functions:strings,image:{type:['string','null']},source:sourceIds,position:vec,rotation:vec,size:vec,ports:strings,links:strings,parent:{type:['string','null']},children:strings,index:{type:'integer',minimum:0},trayIndex:{type:'integer',minimum:0,maximum:17}},additionalProperties:false},
  port:{type:'object',required:['id','entity','type','physicalCount','semantics'],properties:{id:string,entity:string,type:string,physicalCount:{type:['integer','null']},semantics:string},additionalProperties:false},
  link:{type:'object',required:['id','source','target','sourcePort','targetPort','type','name','bandwidth','confidence','evidence','physicalLaneCount','semantics','flow'],properties:{id:string,source:string,target:string,sourcePort:string,targetPort:string,type:{enum:['nvlink','c2c','pcie','scaleout','astra','storage','management','power','cooling','trust']},name:string,bandwidth:{type:['string','null']},confidence:ref('confidence'),evidence:sourceIds,physicalLaneCount:{type:['integer','null']},semantics:string,flow:{enum:['data','control','storage','management','infrastructure','evidence']}},additionalProperties:false}
 }
};
fs.writeFileSync('data/nvl72-topology.schema.json',JSON.stringify(schema,null,2));
const topology=JSON.parse(fs.readFileSync('data/nvl72-topology.json'));
fs.writeFileSync('data/example-gpu.json',JSON.stringify({entity:topology.entities.find(e=>e.id==='gpu-01'),links:topology.links.filter(l=>l.source==='gpu-01'||l.target==='gpu-01')},null,2));
