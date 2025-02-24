import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { ReductionModel } from "./tsr-tree-model";
import { ReductionController } from "./tsr-tree-controller";

export class ReductionLayer extends CollectionLayer {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    const children = melodies.map(e => new ReductionController(
      new ReductionModel(e, layer),
      e.melody_analysis.implication_realization
    ));
    super(children, layer);
  }
  renewStrong(layer: number) {
    this.children.forEach((e) => (e as ReductionController).renewStrong(layer === this.layer));
  }
}
