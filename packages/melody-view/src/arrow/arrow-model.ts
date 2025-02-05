import { HierarchyLevel } from "@music-analyzer/controllers";
import { Gravity, IMelodyModel } from "@music-analyzer/melody-analyze";

export class ArrowModel {
  readonly begin: number;
  readonly end: number;
  readonly note?: number;
  readonly next: IMelodyModel;
  readonly gravity: Gravity;
  readonly destination?: number;
  readonly layer: number;
  readonly hierarchy_level: HierarchyLevel;
  constructor(
    melody: IMelodyModel,
    next: IMelodyModel,
    gravity: Gravity,
    hierarchy_level: HierarchyLevel,
    layer?: number
  ) {
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.next = next;
    this.gravity = gravity;
    this.destination = gravity.destination;
    this.layer = layer || 0;
    this.hierarchy_level = hierarchy_level;
  }
}
