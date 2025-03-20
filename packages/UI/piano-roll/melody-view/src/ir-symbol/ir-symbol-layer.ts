import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol";
import { ColorChangeSubscriber, hasArchetype, MelodyColorController } from "@music-analyzer/controllers";

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol>
  implements
  ColorChangeSubscriber {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [
      MelodyColorController,
    ]
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer)));
    controllers[0].register(this)
  }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
