import { RequiredByIRPlotLayer } from "./required-by-ir-plot-layer";
import { HierarchyLevelController } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-controller";

export interface RequiredByIRPlotHierarchy
  extends RequiredByIRPlotLayer {
  readonly hierarchy: HierarchyLevelController,
}
