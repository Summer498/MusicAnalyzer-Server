import { WindowReflectableRegistry } from "./facade/view";
import { TimeRangeController } from "./facade/time-range-controller";

export interface RequiredByChordPart {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}
