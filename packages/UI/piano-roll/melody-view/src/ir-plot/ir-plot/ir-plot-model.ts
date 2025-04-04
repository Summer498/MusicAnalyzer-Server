import { Triad } from "@music-analyzer/irm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_Model } from "@music-analyzer/view";
import { MelodiesCache } from "./melodies-cache";

export class IRPlotModel
  extends MVVM_Model {
  readonly melody: MelodiesCache
  get archetype() { return this.melody.getCurrentNote().melody_analysis.implication_realization as Triad; }
  constructor(
    melody_series: SerializedTimeAndAnalyzedMelody[],
  ) {
    super();
    this.melody = new MelodiesCache(melody_series);
  }
  get is_visible() { return this.melody.is_visible; }
  getRangedMelody() { return this.melody.getRangedMelody() }
  getPositionRatio() { return this.melody.getPositionRatio() }
  getInterval() { return this.melody.getInterval() }
  getCurrentNote() { return this.melody.getCurrentNote() }
}
