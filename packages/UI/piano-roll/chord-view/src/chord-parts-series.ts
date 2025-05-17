import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { Time } from "@music-analyzer/time-and";
import { TimeRangeController } from "@music-analyzer/controllers";

export abstract class ChordPartSeries
  <T extends {
    readonly svg: SVGElement
    readonly model: { readonly time: Time };
    onWindowResized: () => void
    onTimeRangeChanged: () => void
  }>
  extends ReflectableTimeAndMVCControllerCollection<T> {
  constructor(
    id: string,
    controllers: {
      readonly audio: AudioReflectableRegistry
      readonly window: WindowReflectableRegistry,
      readonly time_range: TimeRangeController,
    },
    romans: T[],
  ) {
    super(id, romans);
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
