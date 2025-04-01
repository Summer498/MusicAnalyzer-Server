import { Triad } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { Time } from "./facade";
import { MVVM_Model } from "./facade";

export class IRSymbolModel 
  extends MVVM_Model {
  readonly time: Time;
  readonly note: number;
  readonly archetype: Triad;
  readonly layer: number;
  constructor(e: SerializedTimeAndAnalyzedMelody, layer: number) {
    super();
    this.time = e.time
    this.note = e.note;
    this.archetype = e.melody_analysis.implication_realization as Triad;
    this.layer = layer || 0;
  }
}
