import { HierarchyLevel } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class TSRModel {
  readonly begin: number;
  readonly end: number;
  readonly head: { begin: number, end: number, w: number };
  readonly layer: number;
  readonly hierarchy_level: HierarchyLevel;
  constructor(
    melody: IMelodyModel,
    hierarchy_level: HierarchyLevel,
    layer: number
  ) {
    this.begin = melody.begin;
    this.end = melody.end;
    this.layer = layer;
    this.head = {
      ...melody.head,
      w: melody.head.end - melody.head.begin
    };
    this.hierarchy_level = hierarchy_level;
  }
}