import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByView } from "../abstract/required-by-abstract-view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";

export interface RequiredByReductionViewModel {
  readonly time_range: TimeRangeController
}

export interface RequiredByIRMSymbol
  extends RequiredByView { }

export interface RequiredByReductionView
  extends RequiredByIRMSymbol, RequiredByReductionViewModel {
  readonly window: WindowReflectableRegistry,
}

export interface RequiredByReduction
  extends RequiredByReductionView { }

export interface RequiredByReductionLayer
  extends
  RequiredByReduction,
  RequiredByLayer { }

export interface RequiredByReductionHierarchy
  extends
  RequiredByReductionLayer,
  RequiredByHierarchy { }
