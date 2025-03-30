import { WindowReflectableRegistry } from "@music-analyzer/view";
import { RequiredByIRSymbolView } from "./required-by-ir-symbol-view";
import { TimeRangeController } from "@music-analyzer/controllers";

export interface RequiredByIRSymbol
  extends RequiredByIRSymbolView {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

