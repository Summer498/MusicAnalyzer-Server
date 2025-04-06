import { RequiredByIRPlotLayer } from "../r-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByIRPlotHierarchy
  extends
  RequiredByIRPlotLayer,
  RequiredByHierarchy {}
