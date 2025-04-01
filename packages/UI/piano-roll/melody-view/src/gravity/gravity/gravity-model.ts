import { Gravity } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { Time } from "./facade";
import { MVVM_Model } from "./facade";

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
