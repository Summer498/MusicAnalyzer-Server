import { Triad } from "@music-analyzer/irm/src/archetype/triad/Triad";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { MVVM_Model } from "@music-analyzer/view/src/mvc";
import { MelodiesCache } from "./melodies-cache";

export class IRPlotModel
  extends MVVM_Model {
  readonly melody: MelodiesCache
  get archetype() { return this.melody.getCurrentNote().melody_analysis.implication_realization as Triad; }
  constructor(
    melody_series: TimeAndAnalyzedMelody[],
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
