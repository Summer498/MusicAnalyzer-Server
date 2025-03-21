import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityLayer, RequiredByGravityLayer } from "./gravity-layer";
import { GravitySwitcher, GravitySwitcherSubscriber, HierarchyLevelController } from "@music-analyzer/controllers";
import { CollectionHierarchy } from "@music-analyzer/view";

export interface RequiredByGravityHierarchy
  extends RequiredByGravityLayer {
  readonly switcher: GravitySwitcher,
  readonly hierarchy: HierarchyLevelController,
}

export class GravityHierarchy
  extends CollectionHierarchy<GravityLayer>
  implements
  GravitySwitcherSubscriber {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByGravityHierarchy,
  ) {
    super(mode, hierarchical_melodies.map((e, l) => new GravityLayer(mode, e, l, controllers)));
    controllers.switcher.register(this);
    controllers.hierarchy.register(this);
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
}
