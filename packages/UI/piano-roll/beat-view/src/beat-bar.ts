import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBar } from "./beat-bar-view-model";

export class BeatBarsGroup 
  extends ReflectableTimeAndMVCControllerCollection<BeatBar> {
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[]
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
    const seed = [...Array(N)];
    super("beat-bars", seed.map((_, i) => new BeatBar(beat_info, i)));
  }
}
