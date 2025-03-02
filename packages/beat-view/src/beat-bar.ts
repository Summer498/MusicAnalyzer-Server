import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBarVM } from "./beat-bar-view-model";
import { BeatBarModel } from "./beat-bar-model";

export class BeatBarsGroup extends ReflectableTimeAndMVCControllerCollection<BeatBarVM> {
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[]
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].end) + beat_info.phase;
    const seed = [...Array(N)];
    super("beat-bars", seed.map((_, i) => new BeatBarVM(new BeatBarModel(beat_info, i))));
  }
}
