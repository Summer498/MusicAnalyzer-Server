import { Triad } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "@music-analyzer/view";

export class ReductionModel extends MVVM_Model {
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