import { RequiredByDMelodySeries } from "./r-layer/required-by-d-melody-series";
import { RequiredByMelodyHierarchy } from "./r-hierarchy/required-by-melody-hierarchy";
import { RequiredByIRSymbolHierarchy } from "./r-hierarchy/required-by-ir-symbol-hierarchy";
import { RequiredByIRPlot } from "./r-part/required-by-ir-plot";
import { RequiredByReductionHierarchy } from "./r-hierarchy/required-by-reduction-hierarchy";
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
