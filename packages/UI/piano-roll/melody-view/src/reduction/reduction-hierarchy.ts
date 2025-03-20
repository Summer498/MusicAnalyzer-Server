import { ColorChangeSubscriber, hasArchetype, HierarchyLevelController, HierarchyLevelSubscriber, MelodyColorController } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionHierarchy } from "@music-analyzer/view";
import { ReductionLayer } from "./reduction-layer";

export class ReductionHierarchy
  extends CollectionHierarchy<ReductionLayer>
  implements
  HierarchyLevelSubscriber,
  ColorChangeSubscriber {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [HierarchyLevelController, MelodyColorController]
  ) {
    super("time-span-reduction", hierarchical_melodies.map((e, l) => new ReductionLayer(e, l)));
    controllers.forEach(e => e.register(this));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value >= e.layer);
    this.show.forEach(e => e.renewStrong(value));
    visible_layer.forEach(e => e.renewStrong(value));
    this.setShow(visible_layer);
  }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
