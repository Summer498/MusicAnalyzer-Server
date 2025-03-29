import { BeatInfo } from "@music-analyzer/beat-estimation/src/beat-info";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { BeatBarsSeries } from "./beat-bar-series";
import { RequiredByBeatElements } from "./requirement/beat-elements";

export class BeatElements {
  readonly children: BeatBarsSeries[];
  readonly beat_bars: BeatBarsSeries;
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[],
    controllers: RequiredByBeatElements
  ) {
    this.beat_bars = new BeatBarsSeries(beat_info, melodies, controllers);
    this.children = [this.beat_bars];
  }
}
