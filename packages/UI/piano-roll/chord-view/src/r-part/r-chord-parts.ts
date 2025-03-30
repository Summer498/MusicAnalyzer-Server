import { WindowReflectableRegistry } from "./facade";
import { TimeRangeController } from "./facade";

export interface RequiredByChordPart {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}
