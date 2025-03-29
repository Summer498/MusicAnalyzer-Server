import { ReflectableTimeAndMVCControllerCollection } from "../facade/view";
import { I_TimeAndVM } from "../facade/view";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { WindowReflectable } from "../facade/view";
import { RequiredByChordPartSeries } from "./r-series";
import { IChordPartSeries } from "./i-series";

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
