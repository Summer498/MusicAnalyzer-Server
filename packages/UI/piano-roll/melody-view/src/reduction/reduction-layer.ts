import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer } from "@music-analyzer/view";
import { Reduction } from "./reduction";
import { RequiredByReduction } from "./reduction/reduction";

export interface RequiredByReductionLayer
  extends RequiredByReduction {
  readonly audio: AudioReflectableRegistry
}
export class ReductionLayer
  extends CollectionLayer<Reduction> {
  constructor(
    melody: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: RequiredByReductionLayer
  ) {
    super(layer, melody.map(e => new Reduction(e, layer, controllers)));
    controllers.audio.register(this);
  }
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
}
