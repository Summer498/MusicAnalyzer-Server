import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer, WindowReflectableRegistry } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol";
import { MelodyColorController } from "@music-analyzer/controllers";

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol> {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [MelodyColorController, AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer, [controllers[0], controllers[2]])));
    controllers[1].register(this);
  }
}
