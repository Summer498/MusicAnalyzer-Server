import { HierarchyLevel } from "@music-analyzer/controllers";
import { Archetype } from "@music-analyzer/irm";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class IRSymbolModel {
  readonly begin: number;
  readonly end: number;
  readonly note?: number;
  readonly archetype: Archetype;
  readonly layer: number;
  readonly hierarchy_level: HierarchyLevel;
  constructor(
    melody: IMelodyModel,
    hierarchy_level: HierarchyLevel,
    layer?: number
  ) {
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.archetype = melody.melody_analysis.implication_realization;
    this.layer = layer || 0;
    this.hierarchy_level = hierarchy_level;

  }
}
