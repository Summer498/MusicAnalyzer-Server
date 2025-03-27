import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { IRSymbol } from "./ir-symbol/ir-symbol";
import { RequiredByIRSymbol } from "./ir-symbol/ir-symbol";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";

export interface RequiredByIRSymbolLayer
  extends RequiredByIRSymbol {
  readonly audio: AudioReflectableRegistry
}
export class IRSymbolLayer
  extends CollectionLayer<IRSymbol>
  implements
  TimeRangeSubscriber,
  WindowReflectable {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer)));
  }
  readonly setColor: SetColor = f => this.children.forEach(e=>e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
