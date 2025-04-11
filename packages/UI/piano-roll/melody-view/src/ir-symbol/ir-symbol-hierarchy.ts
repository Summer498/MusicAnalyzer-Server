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
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
    controllers.melody_color.register(this)
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
}
