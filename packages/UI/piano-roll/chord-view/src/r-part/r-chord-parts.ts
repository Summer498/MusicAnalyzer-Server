import { WindowReflectableRegistry } from "../facade/view";
import { TimeRangeController } from "@music-analyzer/controllers/src/slider/time-range/time-range-controller";

export interface RequiredByChordPart {
  window: WindowReflectableRegistry,
  time_range: TimeRangeController,
}
