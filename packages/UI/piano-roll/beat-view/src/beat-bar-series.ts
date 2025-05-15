import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time } from "@music-analyzer/time-and";
import { BeatBar } from "./beat-bar";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";

export interface RequiredByBeatBarsSeries {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export class BeatBarsSeries
  extends ReflectableTimeAndMVCControllerCollection<BeatBar> {
  constructor(
    beat_info: BeatInfo,
    melodies: { time: Time }[],
    controllers: RequiredByBeatBarsSeries
  ) {
    const N = Math.ceil(beat_info.tempo * melodies[melodies.length - 1].time.end) + beat_info.phase;
    const seed = [...Array(N)];
    super("beat-bars", seed.map((_, i) => new BeatBar(beat_info, i)));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
