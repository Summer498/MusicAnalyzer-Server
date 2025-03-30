import { TimeRangeController } from "@music-analyzer/controllers";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { RequiredByMelodyView } from "./required-by-melody-view";
import { RequiredByMelodyBeep } from "./required-by-beep";

export interface RequiredByMelody
  extends RequiredByMelodyBeep, RequiredByMelodyView {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController
}
