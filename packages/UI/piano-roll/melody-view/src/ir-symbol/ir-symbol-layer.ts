import { SetColor } from "@music-analyzer/controllers";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol";
import { I_IRSymbolLayer } from "../ir-plot/i-ir-symbol-layer";

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol>
  implements I_IRSymbolLayer {
  constructor(
    children: IRSymbol[],
    layer: number,
  ) {
    super(layer, children);
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
