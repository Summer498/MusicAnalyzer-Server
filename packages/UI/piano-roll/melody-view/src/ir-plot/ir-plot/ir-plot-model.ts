import { Triad } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_Model } from "@music-analyzer/view";
import { NowAt } from "@music-analyzer/view-parameters";

export class IRPlotModel 
  extends MVVM_Model {
  #index: number;
  #cache: TimeAndAnalyzedMelody[];
  get archetype() { return this.getCurrentNote().melody_analysis.implication_realization as Triad; }
  constructor(
    readonly melody_series: TimeAndAnalyzedMelody[],
  ) {
    super();
    this.#index = 0;
    this.#cache = [];
  }
  private cacheHit() {
    return this.#cache[1]?.time.has(NowAt.get());
  }
  private cacheUpdate() {
    if (this.cacheHit()) { return this.#cache; }
    else {
      this.#index = this.melody_series.findIndex((value) =>
        value.time.has(NowAt.get())
      );
    }
    const i = this.#index;
    const N = this.melody_series.length;
    const melodies = [
      this.melody_series[Math.max(0, i - 1)],
      this.melody_series[Math.max(0, i)],
      this.melody_series[Math.min(i + 1, N - 1)],
      this.melody_series[Math.min(i + 2, N - 1)],
    ];
    this.#cache = melodies;
  }
  private getCurrentIndex() {
    this.cacheUpdate();
    return this.#index;
  }
  get is_visible() {
    const i = this.getCurrentIndex();
    return 1 <= i && i < this.melody_series.length - 1;
  }
  getRangedMelody() {
    this.cacheUpdate();
    return this.#cache;
  }
  getPositionRatio() {
    const melodies = this.getRangedMelody();
    const t = [melodies[1].time.begin, melodies[2].time.begin];
    return (NowAt.get() - t[0]) / (t[1] - t[0]);
  }
  getInterval() {
    const melodies = this.getRangedMelody().map(e => e.note);
    return [
      melodies[1] - melodies[0] || 0,
      melodies[2] - melodies[1] || 0,
      melodies[3] - melodies[2] || 0,
    ];
  }
  getCurrentNote() {
    return this.getRangedMelody()[1];
  }
}
