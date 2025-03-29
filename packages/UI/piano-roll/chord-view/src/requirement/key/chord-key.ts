import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { TimeRangeController } from "@music-analyzer/controllers/src/slider/time-range/time-range-controller";

export interface RequiredByChordKey {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController,
}
