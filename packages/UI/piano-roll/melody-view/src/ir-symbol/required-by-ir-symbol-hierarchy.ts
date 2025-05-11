import { RequiredByHierarchy, RequiredByLayer, RequiredByPart, RequiredByView } from "../abstract/required-by-abstract-hierarchy";

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
