import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByIRPlotLayer } from "./required-by-ir-plot-layer";

export interface RequiredByIRPlotHierarchy
  extends
  RequiredByIRPlotLayer,
  RequiredByHierarchy {}
