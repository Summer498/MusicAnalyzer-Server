import { HierarchyLevelController } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-controller";
import { RequiredByIRSymbolLayer } from "./required-by-ir-symbol-layer";

export interface RequiredByIRSymbolHierarchy
  extends RequiredByIRSymbolLayer {
  readonly hierarchy: HierarchyLevelController
}
