import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { Archetype } from "@music-analyzer/irm";

export class IRSymbolHierarchy extends CollectionHierarchy<IRSymbolLayer> {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
  ) {
    super("implication-realization archetype", hierarchical_melodies.map((melodies, l) => new IRSymbolLayer(l, melodies)));
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
