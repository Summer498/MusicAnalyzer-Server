import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { BeatInfo } from "@music-analyzer/beat-estimation/src/beat-info";
import { BeatBar } from "./beat-bar/beat-bar";
import { RequiredByBeatBarsSeries } from "./requirement/beat-bar-series";
import { IBeatBarsSeries } from "./interface/beat-bar-series";
import { Time } from "@music-analyzer/time-and/src/time";

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
