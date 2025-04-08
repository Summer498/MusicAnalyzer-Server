import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByIRSymbol } from "./required-by-ir-symbol";

export interface RequiredByIRSymbolLayer
  extends
  RequiredByIRSymbol,
  RequiredByLayer { }
