import { TimeAndAnalyzedMelody } from "./facade";
import { CollectionLayer } from "./facade";
import { SetColor } from "./facade";
import { IRSymbol } from "./ir-symbol";
import { I_IRSymbolLayer } from "../interface/ir-symbol/ir-symbol-layer";

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol>
  implements I_IRSymbolLayer {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer)));
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
