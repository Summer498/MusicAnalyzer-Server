import { HierarchyLevelController } from "./facade";
import { RequiredByIRSymbolLayer } from "./required-by-ir-symbol-layer";

export interface RequiredByIRSymbolHierarchy
  extends RequiredByIRSymbolLayer {
  readonly hierarchy: HierarchyLevelController
}
