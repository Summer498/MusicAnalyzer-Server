import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { I_TimeAndVM } from "@music-analyzer/view";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { IChordPartSeries } from "../i-series";
import { RequiredByChordPartSeries } from "../r-series";

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
