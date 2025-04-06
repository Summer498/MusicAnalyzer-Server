import { Triad } from "@music-analyzer/irm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Model } from "./abstract-model";

export class ReductionModel
  extends Model {
  readonly archetype: Triad;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    readonly layer: number,
  ) {
    super(
      e.time,
      e.head,
    );
    this.archetype = e.melody_analysis.implication_realization as Triad;
  }
}