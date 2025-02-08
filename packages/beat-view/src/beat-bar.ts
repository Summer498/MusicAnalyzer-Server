import { AccompanyToAudioRegistry, SvgCollection } from "@music-analyzer/view";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBarController } from "./beat-bar-controller";
import { BeatBarModel } from "./beat-bar-model";

export class BeatBarsGroup extends SvgCollection {
  constructor(
    beat_info: BeatInfo,
    melodies: IMelodyModel[]
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].end) + beat_info.phase;
    const a = [...Array(N)].map(
      (_, i) => new BeatBarController(new BeatBarModel(beat_info, i))
    );

    super(a);
    this.svg.id = "beat-bars";
    AccompanyToAudioRegistry.instance.register(this);
  }
}
