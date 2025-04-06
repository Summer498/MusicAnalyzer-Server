import { RequiredByIRPlot } from "../r-part";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByIRPlotLayer
  extends
  RequiredByIRPlot,
  RequiredByLayer { }
