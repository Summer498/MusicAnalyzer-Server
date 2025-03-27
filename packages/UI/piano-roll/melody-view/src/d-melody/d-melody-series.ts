import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/svg-collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { DMelodyController } from "@music-analyzer/controllers";
import { DMelodyControllerSubscriber } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { DMelody } from "./d-melody";
import { RequiredByDMelody } from "./d-melody";

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
