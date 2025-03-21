import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBar } from "./beat-bar";
import { RequiredByBeatBar } from "./beat-bar/beat-bar";

export interface RequiredByBeatBarsSeries
  extends RequiredByBeatBar { }
export class BeatBarsSeries
  extends ReflectableTimeAndMVCControllerCollection<BeatBar> {
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[],
    controllers: RequiredByBeatBarsSeries
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
    const seed = [...Array(N)];
    super("beat-bars", seed.map((_, i) => new BeatBar(beat_info, i, controllers)));
  }
}
