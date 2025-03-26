import { Triad } from "@music-analyzer/irm";
import { MelodyAnalysis } from "@music-analyzer/melody-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "@music-analyzer/time-and";
import { MVVM_Model } from "@music-analyzer/view";

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

