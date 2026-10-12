import {createRingAllReduce,teachingInputs} from './ring.mjs';
export const ringSnapshots=createRingAllReduce(teachingInputs);
export const inferenceTimeline=[];
for(let token=0;token<4;token++)for(let step=token?2:0;step<8;step++)for(let round=0;round<([4,5].includes(step)?5:1);round++)inferenceTimeline.push({inferenceStep:step,inferenceRound:round,inferenceToken:token});
inferenceTimeline.push({inferenceStep:8,inferenceRound:0,inferenceToken:3});
export function cursorIndex(state){return Math.max(0,inferenceTimeline.findIndex(c=>c.inferenceStep===state.inferenceStep&&c.inferenceRound===state.inferenceRound&&c.inferenceToken===state.inferenceToken))}
export function moveInference(state,delta){const next=Math.max(0,Math.min(inferenceTimeline.length-1,cursorIndex(state)+delta));return {...inferenceTimeline[next],...(next===inferenceTimeline.length-1?{inferencePlaying:false}:{})}}
export function inferenceSnapshot(state){return state.inferenceStep===4?ringSnapshots[state.inferenceRound+1]:state.inferenceStep===5?ringSnapshots[state.inferenceRound+6]:state.inferenceStep>=6?ringSnapshots.at(-1):ringSnapshots[0]}
// 单一计时器；隐藏、暂停和离开视图均取消，过期回调不会重启循环。
export function createPlaybackClock(tick,scheduler={set:(fn,ms)=>setTimeout(fn,ms),clear:id=>clearTimeout(id)}){
 let timer=null,epoch=0;
 function stop(){epoch++;if(timer!==null)scheduler.clear(timer);timer=null}
 return {sync(active,delay){stop();if(!active)return;const generation=epoch;function run(){if(generation!==epoch)return;timer=null;tick();if(generation===epoch)timer=scheduler.set(run,delay)}timer=scheduler.set(run,delay)},stop};
}
