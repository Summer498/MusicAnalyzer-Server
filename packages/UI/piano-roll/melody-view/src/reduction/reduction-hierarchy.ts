import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReductionLayer } from "./reduction-layer";
import { ReductionViewModel } from "./reduction-view";
import { ColorChangeSubscriber, HierarchyLevelSubscriber } from "@music-analyzer/controllers";

export class ReductionHierarchy extends CollectionHierarchy<ReductionLayer> implements HierarchyLevelSubscriber, ColorChangeSubscriber {
  constructor(hierarchical_melodies: TimeAndAnalyzedMelody[][]) {
    super("time-span-reduction", hierarchical_melodies.map((e, l) => new ReductionLayer(e, l)));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(layer => value >= layer.layer);
    this.show.forEach(layer => (layer as ReductionLayer).renewStrong(value));
    visible_layer.forEach(layer => (layer as ReductionLayer).renewStrong(value));
    this.setShow(visible_layer);
  }
  setColor(getColor: (e: ReductionViewModel) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
