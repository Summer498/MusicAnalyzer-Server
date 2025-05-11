import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByPart } from "../abstract/required-by-abstract-part";
import { RequiredByView } from "../abstract/required-by-abstract-view";

export interface RequiredByIRSymbolView
  extends RequiredByView { }

export interface RequiredByIRSymbol
  extends
  RequiredByIRSymbolView,
  RequiredByPart { }

export interface RequiredByIRSymbolLayer
  extends
  RequiredByIRSymbol,
  RequiredByLayer { }

export interface RequiredByIRSymbolHierarchy
  extends
  RequiredByIRSymbolLayer,
  RequiredByHierarchy { }
