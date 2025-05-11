import { GravitySwitcher } from "@music-analyzer/controllers";
import { RequiredByHierarchy, RequiredByLayer, RequiredByPart } from "../abstract/required-by-abstract-hierarchy";

export interface RequiredByGravity
  extends RequiredByPart { }

export interface RequiredByGravityLayer
  extends
  RequiredByGravity,
  RequiredByLayer { }

export interface RequiredByGravityHierarchy
  extends
  RequiredByGravityLayer,
  RequiredByHierarchy {
  readonly switcher: GravitySwitcher,
}
