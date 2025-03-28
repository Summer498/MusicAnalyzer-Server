import { Triad } from "@music-analyzer/irm/src/archetype/triad/Triad";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and/src/time";
import { MVVM_Model } from "@music-analyzer/view/src/mvvm/model";

export class ReductionModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly head: Time;
  readonly archetype: Triad;
  constructor(
    e: TimeAndAnalyzedMelody,
    readonly layer: number,
  ) {
    super();
    this.time = e.time
    this.head = e.head
    this.archetype = e.melody_analysis.implication_realization as Triad;
  }
}