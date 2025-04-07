import { GravitySwitcher } from "@music-analyzer/controllers";
import { RequiredByHierarchy } from "../r-hierarchy";
import { RequiredByGravityLayer } from "./required-by-gravity-layer";

export interface RequiredByGravityHierarchy
  extends
  RequiredByGravityLayer,
  RequiredByHierarchy {
  readonly switcher: GravitySwitcher,
}
