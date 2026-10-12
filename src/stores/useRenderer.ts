import {create} from 'zustand';
import {initialRendererState,rendererTransition,type RendererState,type RendererEvent} from '../utils/renderer-state.mjs';
export const useRenderer=create<RendererState & {dispatch:(event:RendererEvent)=>void}>(set=>({...initialRendererState,dispatch:event=>set(state=>rendererTransition(state,event))}));
