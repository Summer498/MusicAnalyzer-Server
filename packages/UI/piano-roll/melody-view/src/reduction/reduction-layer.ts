import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer, WindowReflectable } from "@music-analyzer/view";
import { Reduction, RequiredByReduction } from "./reduction";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

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
    controllers: RequiredByReductionLayer
  ) {
    super(layer, melody.map(e => new Reduction(e, layer, controllers)));
  }
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
