import { Gravity, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_Model } from "@music-analyzer/view";

export class GravityModel extends MVVM_Model {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly note: number;
  readonly destination?: number;
  readonly layer: number;
  constructor(
    e: TimeAndAnalyzedMelody,
    layer: number,
    readonly next: TimeAndAnalyzedMelody,
    readonly gravity: Gravity,
  ) {
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.duration = e.end - e.begin;
    this.note = e.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}
