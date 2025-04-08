import { Gravity } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "../serialized-time-and-analyzed-melody";
import { Model } from "../abstract/abstract-model";

export class GravityModel 
  extends Model {
  readonly note: number;
  readonly destination?: number;
  readonly layer: number;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    layer: number,
    readonly next: SerializedTimeAndAnalyzedMelody,
    readonly gravity: Gravity,
  ) {
    super(
      e.time,
      e.head,
    );
    this.note = e.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
  }
}
