import { Archetype } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVCModel } from "@music-analyzer/view";

export class IRSymbolModel extends MVCModel {
  readonly begin: number;
  readonly end: number;
  readonly duration: number;
  readonly note: number;
  readonly archetype: Archetype;
  readonly layer: number;
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer?: number
  ) {
    super();
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.duration = melody.end - melody.begin;
    this.archetype = melody.melody_analysis.implication_realization;
    this.layer = layer || 0;
  }
}
