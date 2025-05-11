import { GravitySwitcher } from "@music-analyzer/controllers";
import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByPart } from "../abstract/required-by-abstract-part";

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
