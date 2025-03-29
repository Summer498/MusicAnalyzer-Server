import { RequiredByGravityLayer } from "./required-by-gravity-layer";
import { GravitySwitcher } from "@music-analyzer/controllers/src/switcher/gravity/gravity-switcher";
import { HierarchyLevelController } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-controller";

export interface RequiredByGravityHierarchy
  extends RequiredByGravityLayer {
  readonly switcher: GravitySwitcher,
  readonly hierarchy: HierarchyLevelController,
}
