// 以每个分块一个标量演示环形归约；网络与密钥行为不在此数值模型内。
export function createRingAllReduce(inputs) {
  const ranks=inputs.length;
  if(ranks<2||inputs.some(row=>row.length!==ranks||row.some(value=>!Number.isFinite(value))))throw new Error('示例需要至少2个rank，且每个rank提供等于rank数的有限标量分块。');
  let buffers=inputs.map(row=>[...row]);
  const snapshots=[{phase:'initial',round:0,buffers:buffers.map(row=>[...row]),packets:[]}];
  for(const phase of ['reduce-scatter','all-gather'])for(let round=0;round<ranks-1;round++){
    const packets=Array.from({length:ranks},(_,rank)=>{
      const chunk=(rank+(phase==='all-gather'?1:0)-round+ranks)%ranks;
      return {source:rank,target:(rank+1)%ranks,chunk,value:buffers[rank][chunk]};
    });
    const next=buffers.map(row=>[...row]);
    for(const packet of packets)next[packet.target][packet.chunk]=phase==='reduce-scatter'?next[packet.target][packet.chunk]+packet.value:packet.value;
    buffers=next;
    snapshots.push({phase,round:round+1,buffers:buffers.map(row=>[...row]),packets});
  }
  return snapshots;
}
export const teachingInputs=Array.from({length:6},(_,rank)=>Array.from({length:6},(_,chunk)=>(rank+1)*(chunk+1)));
