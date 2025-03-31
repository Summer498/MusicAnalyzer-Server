import { WindowReflectableRegistry } from "./facade";
import { TimeRangeController } from "./facade";

export interface RequiredByGravity {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}
