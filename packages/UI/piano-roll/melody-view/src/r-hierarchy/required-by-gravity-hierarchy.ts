import { GravitySwitcher } from "@music-analyzer/controllers";
import { RequiredByGravityLayer } from "../r-layer/required-by-gravity-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByGravityHierarchy
  extends
  RequiredByGravityLayer,
  RequiredByHierarchy {
  readonly switcher: GravitySwitcher,
}
