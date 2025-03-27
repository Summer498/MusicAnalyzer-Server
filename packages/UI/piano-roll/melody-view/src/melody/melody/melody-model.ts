import { Triad } from "@music-analyzer/irm/src/archetype/triad/Triad";
import { MelodyAnalysis } from "@music-analyzer/melody-analyze/src/melody-analysis";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and/src/time";
import { MVVM_Model } from "@music-analyzer/view/src/mvc";

export class MelodyModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly note: number;
  readonly head: Time;
  readonly melody_analysis: MelodyAnalysis;
  readonly archetype: Triad;
  constructor(e: TimeAndAnalyzedMelody) {
    super();
    this.time = e.time
    this.note = e.note;
    this.head = e.head;
    this.melody_analysis = e.melody_analysis;
    this.archetype = e.melody_analysis.implication_realization as Triad;
  }
}

