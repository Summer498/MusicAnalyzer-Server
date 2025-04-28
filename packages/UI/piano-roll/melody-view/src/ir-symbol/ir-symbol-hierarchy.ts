import { SetColor } from "@music-analyzer/controllers";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { RequiredByIRSymbolHierarchy } from "./required-by-ir-symbol-hierarchy";
import { Hierarchy } from "../abstract/abstract-hierarchy";

export class IRSymbolHierarchy
  extends Hierarchy<IRSymbolLayer> {
  constructor(
    children: IRSymbolLayer[],
    controllers: RequiredByIRSymbolHierarchy
  ) {
    super("implication-realization archetype", children);
    controllers.hierarchy.addListeners(this.onChangedLayer.bind(this));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
    controllers.melody_color.addListeners(this.setColor.bind(this))
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
}
