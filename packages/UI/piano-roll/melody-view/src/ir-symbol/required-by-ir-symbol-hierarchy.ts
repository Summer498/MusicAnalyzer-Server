import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByIRSymbolLayer } from "./required-by-ir-symbol-layer";

export interface RequiredByIRSymbolHierarchy
  extends
  RequiredByIRSymbolLayer,
  RequiredByHierarchy { }
