import { GravitySwitcher } from "@music-analyzer/controllers";
import { RequiredByGravityLayer } from "./required-by-gravity-layer";
import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";

export interface RequiredByGravityHierarchy
  extends
  RequiredByGravityLayer,
  RequiredByHierarchy {
  readonly switcher: GravitySwitcher,
}
