// 每个标量分块同时携带来源rank集合，禁止重复归约与提前标记完成。
export function createRingAllReduce(inputs){
 const ranks=inputs.length;
 if(ranks<2||inputs.some(row=>row.length!==ranks||row.some(v=>!Number.isFinite(v))))throw new Error('示例需要至少2个rank，且每个rank提供等于rank数的有限标量分块。');
 let buffers=inputs.map(row=>[...row]),contributors=inputs.map((row,r)=>row.map(()=>[r]));
 const snapshot=(phase,round,packets)=>({phase,round,buffers:buffers.map(row=>[...row]),contributors:contributors.map(row=>row.map(x=>[...x])),packets,ownersByChunk:Array.from({length:ranks},(_,k)=>(k+ranks-1)%ranks)});
 const snapshots=[snapshot('initial',0,[])];
 for(const phase of ['reduce-scatter','all-gather'])for(let round=0;round<ranks-1;round++){
  const packets=Array.from({length:ranks},(_,rank)=>{const chunk=(rank+(phase==='all-gather'?1:0)-round+ranks)%ranks;return {source:rank,target:(rank+1)%ranks,chunk,value:buffers[rank][chunk],contributors:[...contributors[rank][chunk]]}});
  const next=buffers.map(row=>[...row]),provenance=contributors.map(row=>row.map(x=>[...x]));
  for(const packet of packets){
   if(phase==='reduce-scatter'){
    const existing=provenance[packet.target][packet.chunk];
    if(packet.contributors.some(r=>existing.includes(r)))throw new Error('检测到分块被重复归约');
    next[packet.target][packet.chunk]+=packet.value;provenance[packet.target][packet.chunk]=[...existing,...packet.contributors].sort((a,b)=>a-b);
   }else{next[packet.target][packet.chunk]=packet.value;provenance[packet.target][packet.chunk]=[...packet.contributors]}
  }
  buffers=next;contributors=provenance;snapshots.push(snapshot(phase,round+1,packets));
 }
 return snapshots;
}
export function reduceScatterByOutputRank(snapshots){const s=snapshots.findLast(s=>s.phase==='reduce-scatter');if(!s)throw new Error('缺少Reduce-Scatter状态');return s.ownersByChunk.map((owner,chunk)=>s.buffers[owner][chunk])}
export const teachingInputs=Array.from({length:6},(_,rank)=>Array.from({length:6},(_,chunk)=>(rank+1)*(chunk+1)));
