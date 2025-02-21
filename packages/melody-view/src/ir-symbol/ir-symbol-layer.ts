import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbolController } from "./ir-symbol-controller";
import { IRSymbolModel } from "./ir-symbol-model";

export class IRSymbolLayer extends CollectionLayer {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number
  ) {
    const children = melodies.map(e => new IRSymbolController(new IRSymbolModel(e, layer)));
    super(children, layer);
  }
}
