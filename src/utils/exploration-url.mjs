const views=['rack','tray','fabric','network','security','trust','inference'];
const topics=['rack','tray','fabric','network','astra','confidential','scalein','sentry','oasp','tor','c2c','platform','linkcrypto'];
const integer=(params,key,min,max,fallback)=>{const text=params.get(key);return text&&/^\d+$/.test(text)&&Number(text)>=min&&Number(text)<=max?Number(text):fallback};
export function parseExploration(hash,entities){
 const p=new URLSearchParams(hash.replace(/^#/,'')),map=new Map(entities.map(e=>[e.id,e]));
 let view=views.includes(p.get('view'))?p.get('view'):'rack',trayIndex=integer(p,'tray',1,18,1)-1;
 const fallback=view==='tray'?`tray-${String(trayIndex+1).padStart(2,'0')}`:view==='fabric'||view==='inference'?'gpu-01':view==='security'?'realm':view==='trust'?'root':view==='network'?'external':'rack-01';
 const selectedId=map.has(p.get('component'))?p.get('component'):fallback,entity=map.get(selectedId);
 if(entity?.trayIndex!==undefined)trayIndex=entity.trayIndex;
 let inferenceStep=integer(p,'phase',1,9,1)-1,inferenceToken=integer(p,'token',1,4,1)-1;
 if(inferenceStep<2)inferenceToken=0;if(inferenceStep===8)inferenceToken=3;
 const inferenceRound=[4,5].includes(inferenceStep)?integer(p,'round',1,5,1)-1:0;
 const sourceGpu=entity?.type==='gpu'?entity.index:integer(p,'source',1,72,1)-1;
 let targetGpu=integer(p,'target',1,72,38)-1;if(targetGpu===sourceGpu)targetGpu=(sourceGpu+37)%72;
 return {view,trayIndex,selectedId,securityGuide:topics.includes(p.get('topic'))?p.get('topic'):null,inferenceMode:p.get('mode')==='os'?'os':'realm',inferenceStep,inferenceRound,inferenceToken,inferencePlaying:false,animated:false,sourceGpu,targetGpu,fabricTray:integer(p,'switchTray',1,9,1)-1,fabricAsic:integer(p,'asic',1,4,1)-1,fabricStage:integer(p,'stage',1,5,5)-1,fabricMode:p.get('fabric')==='switchTray'?'switchTray':'topology',fabricOperation:['p2p','allreduce','moe'].includes(p.get('operation'))?p.get('operation'):'p2p',photoMode:false};
}
export function serializeExploration(s){
 const p=new URLSearchParams({view:s.view,tray:String(s.trayIndex+1),component:s.selectedId});
 if(s.securityGuide)p.set('topic',s.securityGuide);
 if(s.view==='inference'){p.set('mode',s.inferenceMode);p.set('phase',String(s.inferenceStep+1));p.set('round',String(s.inferenceRound+1));p.set('token',String(s.inferenceToken+1))}
 if(s.view==='fabric'){p.set('source',String(s.sourceGpu+1));p.set('target',String(s.targetGpu+1));p.set('switchTray',String(s.fabricTray+1));p.set('asic',String(s.fabricAsic+1));p.set('stage',String(s.fabricStage+1));p.set('fabric',s.fabricMode);p.set('operation',s.fabricOperation)}
 return '#'+p.toString();
}
