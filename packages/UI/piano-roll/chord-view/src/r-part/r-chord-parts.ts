import { WindowReflectableRegistry } from "./facade/view";
import { TimeRangeController } from "./facade/controllers";

export interface RequiredByChordPart {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}
