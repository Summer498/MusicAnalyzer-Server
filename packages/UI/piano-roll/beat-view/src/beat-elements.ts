import { BeatInfo } from "@music-analyzer/beat-estimation/src/beat-info";
import { BeatBarsSeries } from "./beat-bar-series";
import { RequiredByBeatElements } from "./requirement/beat-elements";
import { Time } from "@music-analyzer/time-and/src/time";

export class BeatElements {
  readonly children: BeatBarsSeries[];
  readonly beat_bars: BeatBarsSeries;
  constructor(
    beat_info: BeatInfo,
    melodies: { time: Time }[],
    controllers: RequiredByBeatElements
  ) {
    this.beat_bars = new BeatBarsSeries(beat_info, melodies, controllers);
    this.children = [this.beat_bars];
  }
}
