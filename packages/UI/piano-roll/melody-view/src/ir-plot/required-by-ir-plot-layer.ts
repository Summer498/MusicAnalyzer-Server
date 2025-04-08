import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByIRPlot } from "./required-by-ir-plot";

export interface RequiredByIRPlotLayer
  extends
  RequiredByIRPlot,
  RequiredByLayer { }
