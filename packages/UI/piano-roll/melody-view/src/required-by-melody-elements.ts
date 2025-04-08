import { RequiredByDMelodySeries } from "./d-melody/required-by-d-melody-series";
import { RequiredByIRPlot } from "./ir-plot/required-by-ir-plot";
import { GravityController } from "@music-analyzer/controllers";
import { RequiredByMelodyHierarchy } from "./melody/required-by-melody-hierarchy";
import { RequiredByIRSymbolHierarchy } from "./ir-symbol/required-by-ir-symbol-hierarchy";
import { RequiredByReductionHierarchy } from "./reduction/required-by-reduction-hierarchy";

export interface RequiredByMelodyElements
  extends
  RequiredByDMelodySeries,
  RequiredByMelodyHierarchy,
  RequiredByIRSymbolHierarchy,
  RequiredByIRPlot,
  RequiredByReductionHierarchy {
  readonly gravity: GravityController
}
