import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReductionLayer } from "./reduction-layer";
import { Archetype } from "@music-analyzer/irm";

export class ReductionHierarchy extends CollectionHierarchy<ReductionLayer> {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][]
  ) {
    super("time-span-reduction", hierarchical_melodies.map((melody, l) => new ReductionLayer(l, melody)));
  }
  onChangedLayer(value: number): void {
    const visible_layer = this.children.filter(
      layer => value >= layer.layer
    );
    this.show.forEach(layer => (layer as ReductionLayer).renewStrong(value));
    visible_layer.forEach(layer => (layer as ReductionLayer).renewStrong(value));
    this.setShow(visible_layer);
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
