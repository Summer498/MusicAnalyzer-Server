import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol";
import { hasArchetype } from "@music-analyzer/controllers";

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol> {
  constructor(melodies: TimeAndAnalyzedMelody[], layer: number) {
    super(layer, melodies.map(e => new IRSymbol(e, layer)));
  }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
