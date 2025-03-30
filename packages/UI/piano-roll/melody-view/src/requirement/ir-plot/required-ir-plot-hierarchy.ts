import { RequiredByIRPlotLayer } from "./required-by-ir-plot-layer";
import { HierarchyLevelController } from "@music-analyzer/controllers";

export interface RequiredByIRPlotHierarchy
  extends RequiredByIRPlotLayer {
  readonly hierarchy: HierarchyLevelController,
}
