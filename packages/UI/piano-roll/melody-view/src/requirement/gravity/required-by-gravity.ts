import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";

export interface RequiredByGravity {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}
