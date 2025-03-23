import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionLayer, WindowReflectable } from "@music-analyzer/view";
import { IRSymbol, RequiredByIRSymbol } from "./ir-symbol";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

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
    controllers: RequiredByIRSymbolLayer
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer, controllers)));
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
