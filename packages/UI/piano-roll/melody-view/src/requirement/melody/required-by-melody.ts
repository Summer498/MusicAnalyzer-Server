import { TimeRangeController } from "@music-analyzer/controllers/src/slider/time-range/time-range-controller";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { RequiredByMelodyView } from "./required-by-melody-view";
import { RequiredByMelodyBeep } from "./required-by-beep";

export interface RequiredByMelody
  extends RequiredByMelodyBeep, RequiredByMelodyView {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController
}
