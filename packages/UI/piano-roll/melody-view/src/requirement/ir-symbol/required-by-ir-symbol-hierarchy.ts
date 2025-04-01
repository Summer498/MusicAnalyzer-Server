import { HierarchyLevelController } from "@music-analyzer/controllers";
import { RequiredByIRSymbolLayer } from "./required-by-ir-symbol-layer";

export interface RequiredByIRSymbolHierarchy
  extends RequiredByIRSymbolLayer {
  readonly hierarchy: HierarchyLevelController
}
