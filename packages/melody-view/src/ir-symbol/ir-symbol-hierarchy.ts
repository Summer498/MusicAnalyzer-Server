import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { Archetype } from "@music-analyzer/irm";

export class IRSymbolHierarchy extends CollectionHierarchy<IRSymbolLayer> {
  readonly children: IRSymbolLayer[];
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
  ) {
    super();
    this.svg.id = "implication-realization archetype";
    this.children = hierarchical_melodies.map((melodies, l) => new IRSymbolLayer(l, melodies));
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
