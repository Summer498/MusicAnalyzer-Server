import { RequiredByIRSymbolView } from "./required-by-ir-symbol-view";
import { RequiredByPart } from "../abstract/required-by-abstract-part";

export interface RequiredByIRSymbol
  extends
  RequiredByIRSymbolView,
  RequiredByPart { }
