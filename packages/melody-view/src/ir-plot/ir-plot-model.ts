import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { MVCModel } from "@music-analyzer/view";
import { NowAt } from "@music-analyzer/view-parameters";

export class IRPlotModel extends MVCModel {
  readonly melody_series: IMelodyModel[];
  #index: number;
  #cache: IMelodyModel[];
  constructor(melody_series: IMelodyModel[]) {
    super();
    this.melody_series = melody_series;
    this.#index = 0;
    this.#cache = [];
  }
  private cacheHit() {
    return this.#cache[1]?.begin <= NowAt.value && NowAt.value < this.#cache[1]?.end;
  }
  private cacheUpdate() {
    if (this.cacheHit()) { return this.#cache; }
    else {
      this.#index = this.melody_series.findIndex((value) =>
        value.begin <= NowAt.value && NowAt.value < value.end
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
    const t = [melodies[1].begin, melodies[2].begin];
    return (NowAt.value - t[0]) / (t[1] - t[0]);
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
