import { HierarchyLevelController } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-controller";
import { RequiredByReductionLayer } from "./required-by-reduction-layer";

export interface RequiredByReductionHierarchy
  extends RequiredByReductionLayer {
  readonly hierarchy: HierarchyLevelController
}
