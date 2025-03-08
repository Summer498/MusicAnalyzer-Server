import { Archetype } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "@music-analyzer/view";

export class ReductionModel extends MVVM_Model {
  readonly time: Time;
  readonly head: Time;
  readonly archetype: Archetype;
  constructor(
    e: TimeAndAnalyzedMelody,
    readonly layer: number,
  ) {
    super();
    this.time = new Time(e.begin,e.end);
    this.head = new Time(e.head.begin, e.head.end);
    this.archetype = e.melody_analysis.implication_realization;
  }
}