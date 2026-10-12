// 每次重试都有独立代次；迟到的回调不能覆盖新场景状态。
export const initialRendererState={status:'loading',generation:0};
export function rendererTransition(state,event){
 if(event.type==='2d')return {...state,status:'2d'};
 if(event.type==='retry')return state.status==='loading'||state.status==='ready'?state:{status:'loading',generation:state.generation+1};
 if(event.generation!==state.generation||!['loading','ready'].includes(state.status))return state;
 if(event.type==='ready'&&state.status==='loading')return {...state,status:'ready'};
 if(event.type==='lost')return {...state,status:'lost'};
 if(event.type==='failed')return {...state,status:'failed'};
 return state;
}
