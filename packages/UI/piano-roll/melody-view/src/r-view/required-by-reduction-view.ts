import { WindowReflectableRegistry } from "@music-analyzer/view";
import { RequiredByReductionViewModel } from "./required-by-reduction-view-model";
import { RequiredByIRMSymbol } from "./required-by-irm-symbol";

export interface RequiredByReductionView
  extends RequiredByIRMSymbol, RequiredByReductionViewModel {
  readonly window: WindowReflectableRegistry,
}