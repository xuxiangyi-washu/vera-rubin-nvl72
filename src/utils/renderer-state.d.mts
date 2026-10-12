export type RendererStatus='loading'|'ready'|'failed'|'lost'|'2d';
export interface RendererState{status:RendererStatus;generation:number}
export type RendererEvent={type:'2d'|'retry'}|{type:'ready'|'failed'|'lost';generation:number};
export const initialRendererState:RendererState;
export function rendererTransition(state:RendererState,event:RendererEvent):RendererState;
