import { RequiredByIRSymbolLayer } from "../r-layer/required-by-ir-symbol-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByIRSymbolHierarchy
  extends
  RequiredByIRSymbolLayer,
  RequiredByHierarchy { }
