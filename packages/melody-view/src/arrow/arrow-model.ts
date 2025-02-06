import { HierarchyLevel } from "@music-analyzer/controllers";
import { Gravity, IMelodyModel } from "@music-analyzer/melody-analyze";
import { MVCModel } from "@music-analyzer/view";

export class ArrowModel extends MVCModel {
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
    super();
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
