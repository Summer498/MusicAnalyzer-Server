import { RequiredByIRSymbolView } from "../r-view/required-by-ir-symbol-view";
import { RequiredByPart } from "./required-by-abstract-part";

export interface RequiredByIRSymbol
  extends
  RequiredByIRSymbolView,
  RequiredByPart { }
