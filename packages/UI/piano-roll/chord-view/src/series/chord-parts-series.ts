import { TimeRangeSubscriber } from "./facade";
import { ReflectableTimeAndMVCControllerCollection } from "./facade";
import { I_TimeAndVM } from "./facade";
import { WindowReflectable } from "./facade";
import { RequiredByChordPartSeries } from "./facade";
import { IChordPartSeries } from "./facade";

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
