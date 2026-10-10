export type Confidence = '已确认' | '待核实' | '冲突';
export type ViewMode = 'rack' | 'tray' | 'fabric' | 'network' | 'security' | 'trust' | 'inference';
export type LinkType = 'nvlink' | 'c2c' | 'pcie' | 'scaleout' | 'astra' | 'storage' | 'management' | 'power' | 'cooling' | 'trust';
export type Vec3 = [number, number, number];
export interface Fact { label: string; value: string; confidence: Confidence; source: string[]; note?: string }
export interface Source { id: string; title: string; url?: string; section?: string; claims?: string[]; confidence?: string; file?: string }
export interface ComponentModel {
  name: string; model: string; color: string; count: string; summary: string;
  specs: Fact[]; functions: string[]; connections: string[]; source: string[]; caveat?: string;
}
export interface Entity {
  id: string; name: string; type: string; model: string; vendor: string;
  specs: Fact[]; functions: string[]; image: string | null; source: string[];
  position: Vec3; rotation: Vec3; size: Vec3; ports: string[]; links: string[];
  parent: string | null; children: string[]; index?: number; trayIndex?: number;
}
export interface Link {
  id: string; source: string; target: string; sourcePort: string; targetPort: string;
  type: LinkType; name: string; bandwidth: string | null; confidence: Confidence;
  evidence: string[]; physicalLaneCount: number | null; semantics: string; flow: string;
}
export interface Port { id: string; entity: string; type: string; physicalCount: number | null; semantics: string }
export interface Topology {
  metadata: { title: string; asOf: string; version: string; disclaimer: string; corrections: string[] };
  rack: string; entities: Entity[]; ports: Port[]; links: Link[];
  networks: { id: string; name: string; color: string; scope: string }[];
  security_domains: { id: string; name: string; members: string[]; note: string; source: string[] }[];
}
