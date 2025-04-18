import { I_TimeAndVM } from "@music-analyzer/view";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { RequiredByChordPartSeries } from "../r-series";

export abstract class ChordPartSeries
  <T extends I_TimeAndVM & { onWindowResized: () => void } & { onTimeRangeChanged: () => void }>
  extends ReflectableTimeAndMVCControllerCollection<T> {
  constructor(
    id: string,
    controllers: RequiredByChordPartSeries,
    romans: T[],
  ) {
    super(id, romans);
    controllers.audio.addListeners(this.onAudioUpdate);
    controllers.window.addListeners(this.onWindowResized);
    controllers.time_range.addListeners(this.onTimeRangeChanged);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
