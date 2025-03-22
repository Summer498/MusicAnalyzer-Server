import { MVVM_View, WindowReflectableRegistry } from "@music-analyzer/view";
import { ReductionModel } from "../reduction-model";
import { ReductionViewModel, RequiredByReductionViewModel } from "./reduction-view-model";
import { IRMSymbol, RequiredByIRMSymbol } from "./irm-symbol";
import { Bracket } from "./bracket";
import { Dot } from "./dot";

export interface RequiredByReductionView
  extends RequiredByIRMSymbol, RequiredByReductionViewModel {
  readonly window: WindowReflectableRegistry,
}
export class ReductionView
  extends MVVM_View<"g", ReductionViewModel> {
  readonly svg: SVGGElement;
  readonly bracket: Bracket;
  readonly dot: Dot;
  readonly ir_symbol: IRMSymbol;
  constructor(
    model: ReductionModel,
    controllers: RequiredByReductionView,
  ) {
    super("g", new ReductionViewModel(model, controllers));
    this.bracket = new Bracket(this.model);
    this.dot = new Dot(this.model);
    this.ir_symbol = new IRMSymbol(this.model, controllers);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-node";
    this.svg.appendChild(this.bracket.svg);
    if (false) { this.svg.appendChild(this.dot.svg); }
    this.svg.appendChild(this.ir_symbol.svg);
    controllers.window.register(this);
  }
  get strong() { return this.model.strong; }
  set strong(value: boolean) {
    this.model.strong = value;
    this.bracket.updateStrong();
    this.dot.updateStrong();
  }
  onWindowResized() {
    this.model.onWindowResized();
    this.bracket.onWindowResized();
    this.dot.onWindowResized();
    this.ir_symbol.onWindowResized();
  }
}
