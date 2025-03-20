import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { Reduction } from "./reduction";
import { ColorChangeSubscriber, hasArchetype, MelodyColorController } from "@music-analyzer/controllers";

export class ReductionLayer
  extends CollectionLayer<Reduction>
  implements
  ColorChangeSubscriber {
  constructor(
    melody: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [MelodyColorController]
  ) {
    super(layer, melody.map(e => new Reduction(e, layer)));
    controllers[0].register(this);
  }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
}
