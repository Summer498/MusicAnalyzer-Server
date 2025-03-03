import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { ReductionModel } from "./reduction-model";
import { ReductionVM } from "./reduction-view-model";
import { Archetype } from "@music-analyzer/irm";

export class ReductionLayer extends CollectionLayer<ReductionVM> {
  constructor(melody: TimeAndAnalyzedMelody[], layer: number) {
    super(layer, melodies.map(e => new ReductionVM(new ReductionModel(e, layer), e.melody_analysis.implication_realization)));
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
  renewStrong(layer: number) {
    this.children.forEach((e) => (e as ReductionVM).renewStrong(layer === this.layer));
  }
}
