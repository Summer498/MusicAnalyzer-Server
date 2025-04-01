import { HierarchyLevelController } from "@music-analyzer/controllers";
import { RequiredByIRPlotLayer } from "./required-by-ir-plot-layer";

export interface RequiredByIRPlotHierarchy
  extends RequiredByIRPlotLayer {
  readonly hierarchy: HierarchyLevelController,
}
