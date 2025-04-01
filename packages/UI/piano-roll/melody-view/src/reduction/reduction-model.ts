import { Triad } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { Time } from "./facade";
import { MVVM_Model } from "./facade";

export class ReductionModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly head: Time;
  readonly archetype: Triad;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    readonly layer: number,
  ) {
    super();
    this.time = e.time
    this.head = e.head
    this.archetype = e.melody_analysis.implication_realization as Triad;
  }
}