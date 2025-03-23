import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer, WindowReflectable } from "@music-analyzer/view";
import { Reduction, RequiredByReduction } from "./reduction";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color-selector";

export interface RequiredByReductionLayer
  extends RequiredByReduction {
  readonly audio: AudioReflectableRegistry
}
export class ReductionLayer
  extends CollectionLayer<Reduction>
  implements
  TimeRangeSubscriber,
  WindowReflectable {
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
