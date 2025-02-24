import { Archetype  } from "@music-analyzer/irm";
import { MVCView } from "@music-analyzer/view";
import { ReductionModel } from "../reduction-model";
import { ReductionViewModel } from "./reduction-view-model";
import { ReductionBracket } from "./reduction-bracket";
import { ReductionDot } from "./reduction-dot";
import { IRMSymbolOnReduction } from "./irm-symbol-on-reduction";

export class ReductionView extends MVCView {
  readonly svg: SVGGElement;
  readonly model: ReductionViewModel;
  readonly bracket: ReductionBracket;
  readonly dot: ReductionDot;
  readonly ir_symbol: IRMSymbolOnReduction;
  constructor(
    model: ReductionModel,
    readonly archetype: Archetype,
  ) {
    super();
    this.model = new ReductionViewModel(model);
    this.bracket = new ReductionBracket(this.model);
    this.dot = new ReductionDot(this.model);
    this.ir_symbol = new IRMSymbolOnReduction(this.model, archetype);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-node";
    this.svg.appendChild(this.bracket.svg);
    if (false) { this.svg.appendChild(this.dot.svg); }
    this.svg.appendChild(this.ir_symbol.svg);
  }
  get strong() { return this.model.strong; }
  set strong(value: boolean) {
    this.model.strong = value;
    this.bracket.updateStrong();
    this.dot.updateStrong();
  }
  updateColor() {
    this.ir_symbol.updateColor();
  }
  onWindowResized() {
    this.model.onWindowResized();
    this.bracket.onWindowResized();
    this.dot.onWindowResized();
    this.ir_symbol.onWindowResized();
  }
}
