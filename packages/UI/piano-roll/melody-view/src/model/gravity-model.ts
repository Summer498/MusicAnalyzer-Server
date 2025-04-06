import { Gravity } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "@music-analyzer/view";

export class GravityModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly note: number;
  readonly destination?: number;
  readonly layer: number;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    layer: number,
    readonly next: SerializedTimeAndAnalyzedMelody,
    readonly gravity: Gravity,
  ) {
    super();
    this.time = e.time
    this.note = e.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}
