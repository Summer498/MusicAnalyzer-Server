import { Gravity } from "./facade";
import { TimeAndAnalyzedMelody } from "./facade";
import { Time } from "./facade";
import { MVVM_Model } from "./facade";

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
