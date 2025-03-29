import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { IRSymbol } from "./ir-symbol/ir-symbol";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";
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
