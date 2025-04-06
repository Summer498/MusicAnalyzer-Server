import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { Reduction } from "../part/reduction";
import { IReductionLayer } from "../i-layer/i-reduction-layer";

export class ReductionLayer
  extends CollectionLayer<Reduction>
  implements IReductionLayer {
  constructor(
    melody: SerializedTimeAndAnalyzedMelody[],
    layer: number,
  ) {
    super(layer, melody.map(e => new Reduction(e, layer)));
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
