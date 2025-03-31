import { GravityController } from "./facade";
import { RequiredByDMelodySeries } from "./d-melody";
import { RequiredByMelodyHierarchy } from "./melody";
import { RequiredByIRSymbolHierarchy } from "./ir-symbol";
import { RequiredByIRPlot } from "./ir-plot";
import { RequiredByReductionHierarchy } from "./reduction";

export interface RequiredByMelodyElements
  extends
  RequiredByDMelodySeries,
  RequiredByMelodyHierarchy,
  RequiredByIRSymbolHierarchy,
  RequiredByIRPlot,
  RequiredByReductionHierarchy {
  readonly gravity: GravityController
}
