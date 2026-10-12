import type {Entity} from '../models/types';
import type {ExplorerState} from '../stores/useExplorer';
export function parseExploration(hash:string,entities:Entity[]):Partial<ExplorerState>;
export function serializeExploration(state:ExplorerState):string;
