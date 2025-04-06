import { Triad } from "@music-analyzer/irm";
import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Model } from "./abstract-model";

export class MelodyModel
  extends Model {
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
  readonly archetype: Triad;
  constructor(e: SerializedTimeAndAnalyzedMelody) {
    super(
      e.time,
      e.head,
    );
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
    this.archetype = e.melody_analysis.implication_realization as Triad;
  }
}

