import { RequiredByIRSymbolLayer } from "../r-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByIRSymbolHierarchy
  extends
  RequiredByIRSymbolLayer,
  RequiredByHierarchy { }
