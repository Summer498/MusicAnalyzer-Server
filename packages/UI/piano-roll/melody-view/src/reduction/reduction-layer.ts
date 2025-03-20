import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer, WindowReflectableRegistry } from "@music-analyzer/view";
import { Reduction } from "./reduction";
import { MelodyColorController } from "@music-analyzer/controllers";

export class ReductionLayer
  extends CollectionLayer<Reduction> {
  constructor(
    melody: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [MelodyColorController, AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super(layer, melody.map(e => new Reduction(e, layer, controllers)));
  }
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
}
