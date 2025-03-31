import { WindowReflectableRegistry } from "./facade";
import { TimeRangeController } from "./facade";

export interface RequiredByDMelody {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}
