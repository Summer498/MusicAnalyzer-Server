import { Gravity, IMelodyModel } from "@music-analyzer/melody-analyze";
import { MVCModel } from "@music-analyzer/view";

export class ArrowModel extends MVCModel {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly note: number;
  readonly next: IMelodyModel;
  readonly gravity: Gravity;
  readonly destination?: number;
  readonly layer: number;
  constructor(
    melody: IMelodyModel,
    next: IMelodyModel,
    gravity: Gravity,
    layer?: number
  ) {
    super();
    this.begin = melody.begin;
    this.end = melody.end;
    this.duration = melody.end - melody.begin;
    this.note = melody.note;
    this.next = next;
    this.gravity = gravity;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}
