import { BeatInfo } from "./facade";
import { Time } from "./facade";
import { BeatBarsSeries } from "./beat-bar-series";
import { RequiredByBeatElements } from "./requirement";

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
