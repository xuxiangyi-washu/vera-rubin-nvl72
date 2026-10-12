import raw from '../../data/nvl72-topology.json';
import models from './catalog.json';
import evidence from './sources.json';
import type { Topology, ComponentModel, Source } from '../models/types';
export const topology = raw as unknown as Topology;
export const catalog = models as Record<string, ComponentModel>;
export const sources = evidence as unknown as Source[];
export const entityById = new Map(topology.entities.map(entity => [entity.id, entity]));
export const sourceById = new Map(sources.map(source => [source.id, source]));

export { default as hardwareCounts } from './hardware-counts.json';
