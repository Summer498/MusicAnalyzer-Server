import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SetColor } from "@music-analyzer/controllers";
import { IRSymbol } from "./ir-symbol";
import { I_IRSymbolLayer } from "../interface";
import { CollectionLayer } from "@music-analyzer/view";

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol>
  implements I_IRSymbolLayer {
  constructor(
    melodies: SerializedTimeAndAnalyzedMelody[],
    layer: number,
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer)));
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
