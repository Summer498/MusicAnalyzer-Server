import { RequiredByIRPlotLayer } from "../r-layer/required-by-ir-plot-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByIRPlotHierarchy
  extends
  RequiredByIRPlotLayer,
  RequiredByHierarchy {}
