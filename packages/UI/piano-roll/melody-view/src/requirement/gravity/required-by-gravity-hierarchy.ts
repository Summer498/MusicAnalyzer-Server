import { GravitySwitcher } from "./facade";
import { HierarchyLevelController } from "./facade";
import { RequiredByGravityLayer } from "./required-by-gravity-layer";

export interface RequiredByGravityHierarchy
  extends RequiredByGravityLayer {
  readonly switcher: GravitySwitcher,
  readonly hierarchy: HierarchyLevelController,
}
