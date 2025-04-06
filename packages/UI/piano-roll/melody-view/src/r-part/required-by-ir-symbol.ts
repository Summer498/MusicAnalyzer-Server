import { RequiredByIRSymbolView } from "../r-view";
import { RequiredByPart } from "./required-by-abstract-part";

export interface RequiredByIRSymbol
  extends
  RequiredByIRSymbolView,
  RequiredByPart { }
