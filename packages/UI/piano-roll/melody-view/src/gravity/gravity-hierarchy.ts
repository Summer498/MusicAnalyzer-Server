import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityLayer } from "./gravity-layer";
import { GravitySwitcherSubscriber, HierarchyLevelController, HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { GravitySwitcher } from "@music-analyzer/controllers/src/switcher/gravity-switcher";

export class GravityHierarchy
extends CollectionHierarchy<GravityLayer>
implements
  GravitySwitcherSubscriber,
  HierarchyLevelSubscriber {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [
      GravitySwitcher,
      HierarchyLevelController,
    ]
  ) {
    super(mode, hierarchical_melodies.map((e, l) => new GravityLayer(mode, e, l)));
    controllers.forEach(e=>e.register(this))
  }
  onUpdateGravityVisibility(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
}
