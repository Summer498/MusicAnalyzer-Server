import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer } from "@music-analyzer/view";
import { IRSymbol, RequiredByIRSymbol } from "./ir-symbol";

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
