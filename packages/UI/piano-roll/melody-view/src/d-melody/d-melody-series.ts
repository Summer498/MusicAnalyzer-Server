import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection, WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController, DMelodyControllerSubscriber, TimeRangeSubscriber } from "@music-analyzer/controllers";
import { DMelody, RequiredByDMelody } from "./d-melody";

export interface RequiredByDMelodySeries
  extends RequiredByDMelody {
  readonly d_melody: DMelodyController,
  readonly audio: AudioReflectableRegistry,
}

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody>
  implements
  AudioReflectable,
  DMelodyControllerSubscriber,
  TimeRangeSubscriber,
  WindowReflectable {
  constructor(
    detected_melodies: TimeAndAnalyzedMelody[],
    controllers: RequiredByDMelodySeries,
  ) {
    super("detected-melody", detected_melodies.map(e => new DMelody(e)));
    controllers.audio.register(this);
    controllers.d_melody.register(this);
    controllers.time_range.register(this);
    controllers.window.register(this)
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
