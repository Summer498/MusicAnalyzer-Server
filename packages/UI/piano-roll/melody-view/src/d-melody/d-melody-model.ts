import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Model } from "../abstract/abstract-model";

export class DMelodyModel
  extends Model {
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
  constructor(e: SerializedTimeAndAnalyzedMelody) {
    super(
      e.time,
      e.head,
    )
    this.note = e.note;
    this.melody_analysis = e.melody_analysis;
  }
}
