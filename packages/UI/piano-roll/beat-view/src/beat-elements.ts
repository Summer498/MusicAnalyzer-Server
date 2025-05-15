import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time } from "@music-analyzer/time-and";
import { BeatBarsSeries } from "./beat-bar-series";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";

export interface RequiredByBeatElements {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

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
