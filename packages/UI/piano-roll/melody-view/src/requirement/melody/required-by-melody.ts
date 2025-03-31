import { TimeRangeController } from "./facade";
import { WindowReflectableRegistry } from "./facade";
import { RequiredByMelodyView } from "./required-by-melody-view";
import { RequiredByMelodyBeep } from "./required-by-beep";

export interface RequiredByMelody
  extends RequiredByMelodyBeep, RequiredByMelodyView {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController
}
