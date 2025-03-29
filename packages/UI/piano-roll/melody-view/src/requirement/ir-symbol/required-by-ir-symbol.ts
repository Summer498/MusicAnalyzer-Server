import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { RequiredByIRSymbolView } from "./required-by-ir-symbol-view";
import { TimeRangeController } from "@music-analyzer/controllers/src/slider/time-range/time-range-controller";

export interface RequiredByIRSymbol
  extends RequiredByIRSymbolView {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

