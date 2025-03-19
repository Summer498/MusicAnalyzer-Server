import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { ReductionVM } from "./reduction-view-model";
import { ReductionViewModel } from "./reduction-view";

export class ReductionLayer 
extends CollectionLayer<ReductionVM> {
  constructor(melody: TimeAndAnalyzedMelody[], layer: number) {
    super(layer, melody.map(e => new ReductionVM(e, layer)));
  }
  setColor(getColor: (e: ReductionViewModel) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
  renewStrong(layer: number) {
    this.children.forEach((e) => (e as ReductionVM).renewStrong(layer === this.layer));
  }
}
