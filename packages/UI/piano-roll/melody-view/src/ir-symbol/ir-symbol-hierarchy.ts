import { SetColor } from "@music-analyzer/controllers";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { RequiredByIRSymbolHierarchy } from "./required-by-ir-symbol-hierarchy";
import { I_IRSymbolHierarchy } from "./i-ir-symbol-hierarchy";
import { Hierarchy } from "../abstract/abstract-hierarchy";

export class IRSymbolHierarchy
  extends Hierarchy<IRSymbolLayer>
  implements I_IRSymbolHierarchy {
  constructor(
    children: IRSymbolLayer[],
    controllers: RequiredByIRSymbolHierarchy
  ) {
    super("implication-realization archetype", children);
    controllers.hierarchy.addListeners(this.onChangedLayer);
    controllers.audio.addListeners(this.onAudioUpdate);
    controllers.window.addListeners(this.onWindowResized);
    controllers.time_range.addListeners(this.onTimeRangeChanged);
    controllers.melody_color.addListeners(this.setColor)
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
}
