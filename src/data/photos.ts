import manifest from '../../research/official-assets.json';
import groups from './component-images.json';
import type { ViewMode } from '../models/types';
export type OfficialAsset = typeof manifest[number] & { previewUrl?: string };
const groupMap=groups as Record<string,string[]>;
export const getComponentPhotos=(type:string):OfficialAsset[] => (groupMap[type]??[]).map(id=>manifest.find(image=>image.id===id)!).filter(Boolean);
export const viewPhotoTypes:Record<ViewMode,string>={rack:'rack',tray:'compute',fabric:'switchTray',network:'nic',security:'realm',trust:'io',inference:'realm'};
