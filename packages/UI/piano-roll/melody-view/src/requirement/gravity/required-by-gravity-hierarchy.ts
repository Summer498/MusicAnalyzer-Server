import { RequiredByGravityLayer } from "./required-by-gravity-layer";
import { GravitySwitcher } from "@music-analyzer/controllers";
import { HierarchyLevelController } from "@music-analyzer/controllers";

export interface RequiredByGravityHierarchy
  extends RequiredByGravityLayer {
  readonly switcher: GravitySwitcher,
  readonly hierarchy: HierarchyLevelController,
}
