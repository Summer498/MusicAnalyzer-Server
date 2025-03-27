import { Gravity } from "@music-analyzer/melody-analyze/src/gravity";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and/src/time";
import { MVVM_Model } from "@music-analyzer/view/src/mvc";

export class GravityModel 
  extends MVVM_Model {
  readonly time: Time;
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
    this.time = e.time
    this.note = e.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}
