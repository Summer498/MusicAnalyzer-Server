import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol";
import { MelodyColorController } from "@music-analyzer/controllers";

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol> {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [MelodyColorController]
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer, controllers)));
  }
}
