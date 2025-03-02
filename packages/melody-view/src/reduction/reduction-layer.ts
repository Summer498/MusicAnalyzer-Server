import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { ReductionModel } from "./reduction-model";
import { ReductionVM } from "./reduction-controller";
import { Archetype } from "@music-analyzer/irm";

export class ReductionLayer extends CollectionLayer {
  readonly children: ReductionVM[];
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    const children = melodies.map(e => new ReductionVM(
      new ReductionModel(e, layer),
      e.melody_analysis.implication_realization
    ));
    super(children, layer);
    this.children = children;
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e=>e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
  renewStrong(layer: number) {
    this.children.forEach((e) => (e as ReductionVM).renewStrong(layer === this.layer));
  }
}
