import { HierarchyLevelController } from "@music-analyzer/controllers";
import { RequiredByReductionLayer } from "./required-by-reduction-layer";

export interface RequiredByReductionHierarchy
  extends RequiredByReductionLayer {
  readonly hierarchy: HierarchyLevelController
}
