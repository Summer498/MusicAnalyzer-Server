import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { Reduction } from "./reduction/reduction";
import { RequiredByReduction } from "./reduction/reduction";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";

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
