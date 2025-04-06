import { Triad } from "@music-analyzer/irm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Time } from "../facade";
import { MelodiesCache } from "../melodies-cache";
import { Model } from "./abstract-model";

export class IRPlotModel
  extends Model {
  readonly melody: MelodiesCache
  get archetype() { return this.melody.getCurrentNote().melody_analysis.implication_realization as Triad; }
  constructor(
    melody_series: SerializedTimeAndAnalyzedMelody[],
  ) {
    super(
      new Time(0, 0),  // dummy
      new Time(0, 0),  // dummy
    );
    this.melody = new MelodiesCache(melody_series);
  }
  get is_visible() { return this.melody.is_visible; }
  getRangedMelody() { return this.melody.getRangedMelody() }
  getPositionRatio() { return this.melody.getPositionRatio() }
  getInterval() { return this.melody.getInterval() }
  getCurrentNote() { return this.melody.getCurrentNote() }
}
