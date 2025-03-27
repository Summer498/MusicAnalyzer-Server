import { Triad } from "@music-analyzer/irm/src/archetype/triad/Triad";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and/src/time";
import { MVVM_Model } from "@music-analyzer/view/src/mvc";

export class IRSymbolModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly note: number;
  readonly archetype: Triad;
  readonly layer: number;
  constructor(e: TimeAndAnalyzedMelody, layer: number) {
    super();
    this.time = e.time
    this.note = e.note;
    this.archetype = e.melody_analysis.implication_realization as Triad;
    this.layer = layer || 0;
  }
}
