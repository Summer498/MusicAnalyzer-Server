import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { BeatInfo } from "@music-analyzer/beat-estimation/src/beat-info";
import { BeatBar } from "./beat-bar/beat-bar";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { RequiredByBeatBarsSeries } from "./requirement/beat-bar-series";

export class BeatBarsSeries
  extends ReflectableTimeAndMVCControllerCollection<BeatBar>
  implements
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable {
  constructor(
    beat_info: BeatInfo,
    melodies: TimeAndAnalyzedMelody[],
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
