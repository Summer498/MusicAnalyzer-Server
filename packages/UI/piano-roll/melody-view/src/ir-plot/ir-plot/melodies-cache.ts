import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { NowAt } from "@music-analyzer/view-parameters/src/now-at";

class CacheCore {
  #cache: TimeAndAnalyzedMelody[];
  #index: number;
  constructor(
    readonly melody_series: TimeAndAnalyzedMelody[],
  ) {
    this.#cache = [];
    this.#index = 0;
  }

  cacheHit() {
    return this.#cache[1]?.time.has(NowAt.get());
  }
  cacheUpdate() {
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
  get index() {
    this.cacheUpdate();
    return this.#index;
  }
  get melody() {
    this.cacheUpdate();
    return this.#cache;
  }
}



export class MelodiesCache {
  #core: CacheCore;
  constructor(
    melody_series: TimeAndAnalyzedMelody[],
  ) {
    this.#core = new CacheCore(melody_series);
  }
  get is_visible() {
    const i = this.#core.index;
    return 1 <= i && i < this.#core.melody_series.length - 1;
  }
  getRangedMelody() { return this.#core.melody; }
  getPositionRatio() {
    const melodies = this.#core.melody;
    const t = [melodies[1].time.begin, melodies[2].time.begin];
    return (NowAt.get() - t[0]) / (t[1] - t[0]);
  }
  getInterval() {
    const melodies = this.#core.melody.map(e => e.note);
    return [
      melodies[1] - melodies[0] || 0,
      melodies[2] - melodies[1] || 0,
      melodies[3] - melodies[2] || 0,
    ];
  }
  getCurrentNote() {
    return this.#core.melody[1];
  }
}