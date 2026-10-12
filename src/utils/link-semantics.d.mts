import type {LinkType,Link} from '../models/types';
export const linkRoles:Record<LinkType,string>;
export const controlTypes:Set<string>;
export const payloadTypes:Set<string>;
export function payloadLinks(links:Link[]):Link[];
export function isPayloadPath(path:{type:LinkType;flow?:string}):boolean;

export function matchesFlow(path:{type:string;flow?:string},flow:string):boolean;
