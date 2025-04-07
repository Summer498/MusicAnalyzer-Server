import { RequiredByDMelodySeries } from "./r-layer";
import { RequiredByMelodyHierarchy } from "./r-hierarchy";
import { RequiredByIRSymbolHierarchy } from "./r-hierarchy";
import { RequiredByIRPlot } from "./r-part/required-by-ir-plot";
import { RequiredByReductionHierarchy } from "./r-hierarchy";
import { GravityController } from "@music-analyzer/controllers";

export interface RequiredByMelodyElements
  extends
  RequiredByDMelodySeries,
  RequiredByMelodyHierarchy,
  RequiredByIRSymbolHierarchy,
  RequiredByIRPlot,
  RequiredByReductionHierarchy {
  readonly gravity: GravityController
}
