import { SetColor } from "@music-analyzer/controllers";
import { IRSymbol } from "./ir-symbol";
import { Layer } from "../abstract/abstract-layer";

export class IRSymbolLayer
  extends Layer<IRSymbol> {
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
