import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { Reduction } from "./reduction";
import { hasArchetype } from "@music-analyzer/controllers";

export class ReductionLayer
  extends CollectionLayer<Reduction> {
  constructor(melody: TimeAndAnalyzedMelody[], layer: number) {
    super(layer, melody.map(e => new Reduction(e, layer)));
  }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
}
