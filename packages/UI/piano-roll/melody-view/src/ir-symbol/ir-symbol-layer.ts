import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { CollectionLayer } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { IRSymbol } from "./ir-symbol";
import { RequiredByIRSymbol } from "./ir-symbol";
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
