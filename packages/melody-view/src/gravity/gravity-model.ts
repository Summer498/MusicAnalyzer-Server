import { Gravity, TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "@music-analyzer/view";

export class GravityModel extends MVVM_Model {
  readonly time: Time;
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
    this.time = new Time(e.begin, e.end);
    this.duration = e.end - e.begin;
    this.note = e.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}
