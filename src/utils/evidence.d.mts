import type {Source} from '../models/types';
export const sourceKinds:Record<string,string>;
export function sourceLabel(source:Source):string;
export function filterSources(sources:Source[],query?:string,kind?:string):Source[];
