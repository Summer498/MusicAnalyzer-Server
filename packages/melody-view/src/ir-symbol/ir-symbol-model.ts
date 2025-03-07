import { Archetype } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_Model } from "@music-analyzer/view";

export class IRSymbolModel extends MVVM_Model {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly note: number;
  readonly archetype: Archetype;
  readonly layer: number;
  constructor(e: TimeAndAnalyzedMelody, layer: number) {
    super();
    this.begin = e.begin;
    this.end = e.end;
    this.note = e.note;
    this.duration = e.end - e.begin;
    this.archetype = e.melody_analysis.implication_realization;
    this.layer = layer || 0;
  }
}
