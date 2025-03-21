import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatBarsSeries } from "@music-analyzer/beat-view";
import { RequiredByBeatBarsSeries } from "@music-analyzer/beat-view/src/beat-bar-series";

export interface RequiredByBeatElements
  extends RequiredByBeatBarsSeries { }
export class BeatElements {
  readonly children: unknown[];
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
