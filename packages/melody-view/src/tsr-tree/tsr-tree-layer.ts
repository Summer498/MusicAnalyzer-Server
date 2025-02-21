import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { TSRModel } from "./tsr-tree-model";
import { TSRController } from "./tsr-tree-controller";

export class TSRLayer extends CollectionLayer {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    const children = melodies.map(e => new TSRController(
      new TSRModel(e, layer),
      e.melody_analysis.implication_realization
    ));
    super(children, layer);
  }
  renewStrong(layer: number) {
    this.children.forEach((e) => (e as TSRController).renewStrong(layer === this.layer));
  }
}
