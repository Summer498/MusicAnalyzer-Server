import { SetColor } from "@music-analyzer/controllers";
import { Reduction } from "./reduction";
import { IReductionLayer } from "./i-reduction-layer";
import { Layer } from "../abstract/abstract-layer";

export class ReductionLayer
  extends Layer<Reduction>
  implements IReductionLayer {
  constructor(
    children: Reduction[],
    layer: number,
  ) {
    super(layer, children);
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
