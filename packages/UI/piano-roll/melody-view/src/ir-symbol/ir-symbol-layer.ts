import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer, WindowReflectable } from "@music-analyzer/view";
import { IRSymbol, RequiredByIRSymbol } from "./ir-symbol";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color-selector";

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
