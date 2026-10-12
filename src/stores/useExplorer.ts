import { create } from 'zustand';
import type { LinkType, ViewMode } from '../models/types';

export interface ExplorerState {
  researchOpen:boolean; researchSource:string|null; sidebarOpen:boolean; inspectorOpen:boolean; inferenceAnnouncement:string;
  openEvidence:(id?:string)=>void;
  securityGuide: 'rack' | 'tray' | 'fabric' | 'network' | 'astra' | 'confidential' | 'scalein' | 'sentry' | 'oasp' | 'tor' | 'c2c' | 'platform' | 'linkcrypto' | null;
  inferenceMode:'os'|'realm'; inferenceStep:number; inferenceRound:number; inferenceToken:number; inferencePlaying:boolean; inferenceSpeed:number;
  sourceGpu:number; targetGpu:number; fabricTray:number; fabricAsic:number; fabricStage:number; fabricMode:'topology'|'switchTray'; fabricOperation:'p2p'|'allreduce'|'moe'; view: ViewMode; selectedId: string; trayIndex: number; query: string;
  animated: boolean; exploded: boolean; allPaths: boolean; showLabels: boolean;
  lowPower: boolean; rear: boolean; realistic: boolean; photoMode: boolean; resetToken: number; moduleFilter: string;
  flow: string; network: 'ethernet' | 'infiniband'; layers: Record<LinkType, boolean>;
  setView: (view: ViewMode) => void; select: (id: string, trayIndex?: number) => void;
  update: (value: Partial<ExplorerState>) => void; toggleLayer: (type: LinkType) => void;
}
export const useExplorer = create<ExplorerState>((set) => ({
  researchOpen:false,researchSource:null,sidebarOpen:false,inspectorOpen:false,inferenceAnnouncement:'',
  openEvidence:(id)=>set({researchOpen:true,researchSource:id??null}),
  inferenceMode:'realm',inferenceStep:0,inferenceRound:0,inferenceToken:0,inferencePlaying:false,inferenceSpeed:1,
  sourceGpu:0,targetGpu:37,fabricTray:0,fabricAsic:0,fabricStage:4,fabricMode:'topology',fabricOperation:'p2p',
  securityGuide: null, view: 'rack', selectedId: 'rack-01', trayIndex: 0, query: '', animated: false,
  exploded: false, allPaths: false, showLabels: true, lowPower: false, rear: false,
  realistic: true, photoMode: false, resetToken: 0, moduleFilter: 'all', flow: 'all', network: 'ethernet',
  layers: { nvlink: true, c2c: true, pcie: false, scaleout: true, astra: true, storage: true, management: false, power: false, cooling: true, trust: true },
  setView: (view) => set({ view, moduleFilter: 'all', rear: false, photoMode: false,inferencePlaying:false,sidebarOpen:false }),
  select: (selectedId, trayIndex) => set(s => {
    const gpu=selectedId.match(/^gpu-(\d+)$/),sw=selectedId.match(/^switch-(\d+)$/);
    const sourceGpu=gpu?Number(gpu[1])-1:s.sourceGpu;
    const targetGpu=sourceGpu===s.targetGpu?(sourceGpu+37)%72:s.targetGpu;
    return {selectedId,inspectorOpen:true,trayIndex:trayIndex??s.trayIndex,sourceGpu,targetGpu,...(sw?{fabricTray:Math.floor((Number(sw[1])-1)/4),fabricAsic:(Number(sw[1])-1)%4}:{})};
  }),
  update: (value) => set(value),
  toggleLayer: (type) => set(s => ({ layers: { ...s.layers, [type]: !s.layers[type] } })),
}));
