import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { IRSymbol } from "./ir-symbol/ir-symbol";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";

export interface I_IRSymbolLayer
  extends
  TimeRangeSubscriber,
  WindowReflectable { }

export class IRSymbolLayer
  extends CollectionLayer<IRSymbol>
  implements I_IRSymbolLayer {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    super(layer, melodies.map(e => new IRSymbol(e, layer)));
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
