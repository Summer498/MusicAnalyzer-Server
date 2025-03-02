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
    melody: TimeAndAnalyzedMelody,
    readonly next: TimeAndAnalyzedMelody,
    readonly gravity: Gravity,
    layer?: number
  ) {
    super();
    this.begin = melody.begin;
    this.end = melody.end;
    this.duration = melody.end - melody.begin;
    this.note = melody.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}
