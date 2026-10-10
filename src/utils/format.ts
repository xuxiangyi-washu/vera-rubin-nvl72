import type { LinkType } from '../models/types';
export const pad = (value: number, width = 2) => String(value + 1).padStart(width, '0');
export const linkColors: Record<LinkType, string> = {
  nvlink: '#ff6679', c2c: '#ff9b92', pcie: '#c698f2', scaleout: '#60aaff',
  astra: '#9ee446', storage: '#36cfb7', management: '#a5b1b8', power: '#edbb6b', cooling: '#58dbe5', trust: '#c8a0f9',
};
export const linkNames: Record<LinkType, string> = {
  nvlink: 'NVLink 6', c2c: 'NVLink-C2C', pcie: 'PCIe I/O', scaleout: 'Scale-Out',
  astra: 'Astra 控制', storage: '存储 / 带内', management: '带外管理', power: '电力', cooling: '液冷', trust: '证明 / 授权',
};
export function downloadJson(value: unknown, name: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
