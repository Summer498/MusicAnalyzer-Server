import { RequiredByIRSymbol } from "../r-part";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByIRSymbolLayer
  extends
  RequiredByIRSymbol,
  RequiredByLayer { }
