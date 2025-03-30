import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatBar } from "./beat-bar";
import { RequiredByBeatBarsSeries } from "./requirement";
import { IBeatBarsSeries } from "./interface";
import { Time } from "@music-analyzer/time-and";

export class BeatBarsSeries
  extends ReflectableTimeAndMVCControllerCollection<BeatBar>
  implements IBeatBarsSeries {
  constructor(
    beat_info: BeatInfo,
    melodies: { time: Time }[],
    controllers: RequiredByBeatBarsSeries
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
    const seed = [...Array(N)];
    super("beat-bars", seed.map((_, i) => new BeatBar(beat_info, i)));
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
