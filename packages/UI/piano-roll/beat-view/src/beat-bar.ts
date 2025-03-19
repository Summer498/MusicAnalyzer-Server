import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBarVM } from "./beat-bar-view-model";

export class BeatBarsGroup 
extends ReflectableTimeAndMVCControllerCollection<BeatBarVM> {
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[]
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
    const seed = [...Array(N)];
    super("beat-bars", seed.map((_, i) => new BeatBarVM(beat_info, i)));
  }
}
