import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol";
import { RequiredByIRSymbol } from "./ir-symbol/ir-symbol";

export interface RequiredByIRSymbolLayer
  extends RequiredByIRSymbol {
  readonly audio: AudioReflectableRegistry
}
export class IRSymbolLayer
  extends CollectionLayer<IRSymbol> {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: RequiredByIRSymbolLayer
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer, controllers)));
    controllers.audio.register(this);
  }
}
