import { MVVM_View } from "@music-analyzer/view";
import { IRMSymbolOnReduction } from "./irm-symbol-on-reduction";
import { ReductionBracket } from "./reduction-bracket";
import { ReductionDot } from "./reduction-dot";
import { ReductionModel } from "../reduction";
import { ReductionViewModel } from "./reduction-view-model";

export class ReductionView 
  extends MVVM_View<ReductionViewModel, "g"> {
  readonly svg: SVGGElement;
  readonly bracket: ReductionBracket;
  readonly dot: ReductionDot;
  readonly ir_symbol: IRMSymbolOnReduction;
  constructor(model: ReductionModel) {
    const archetype = model.archetype;
    super(new ReductionViewModel(model), "g");
    this.bracket = new ReductionBracket(this.model);
    this.dot = new ReductionDot(this.model);
    this.ir_symbol = new IRMSymbolOnReduction(this.model);

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
  setColor(getColor: (e: ReductionViewModel) => string) {
    this.ir_symbol.setColor(getColor);
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
