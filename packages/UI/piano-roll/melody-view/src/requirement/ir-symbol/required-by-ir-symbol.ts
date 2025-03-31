import { WindowReflectableRegistry } from "./facade";
import { TimeRangeController } from "./facade";
import { RequiredByIRSymbolView } from "./required-by-ir-symbol-view";

export interface RequiredByIRSymbol
  extends RequiredByIRSymbolView {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

