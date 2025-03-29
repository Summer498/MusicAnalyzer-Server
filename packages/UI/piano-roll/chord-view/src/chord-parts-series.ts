import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { I_TimeAndVM } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/i-time-and-model";
import { RequiredByChordPartSeries } from "./r-chord-parts-series";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { IChordPartSeries } from "./i-chord-parts-series";

export abstract class ChordPartSeries
  <T extends I_TimeAndVM & TimeRangeSubscriber & WindowReflectable>
  extends ReflectableTimeAndMVCControllerCollection<T>
  implements IChordPartSeries {
  constructor(
    id: string,
    controllers: RequiredByChordPartSeries,
    romans: T[],
  ) {
    super(id, romans);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
