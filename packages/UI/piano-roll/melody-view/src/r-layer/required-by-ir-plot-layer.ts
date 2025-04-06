import { RequiredByIRPlot } from "../r-part/required-by-ir-plot";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByIRPlotLayer
  extends
  RequiredByIRPlot,
  RequiredByLayer { }
