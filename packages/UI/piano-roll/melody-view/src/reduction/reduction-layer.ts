import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { Reduction } from "./reduction";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";
import { IReductionLayer } from "../interface/reduction/reduction-layer";

export class ReductionLayer
  extends CollectionLayer<Reduction>
  implements IReductionLayer {
  constructor(
    melody: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    super(layer, melody.map(e => new Reduction(e, layer)));
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
