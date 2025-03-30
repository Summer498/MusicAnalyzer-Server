import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol/ir-symbol";
import { SetColor } from "@music-analyzer/controllers";
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
