import { RequiredByIRSymbol } from "../r-part/required-by-ir-symbol";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByIRSymbolLayer
  extends
  RequiredByIRSymbol,
  RequiredByLayer { }
