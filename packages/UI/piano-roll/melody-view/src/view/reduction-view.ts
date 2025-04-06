import { MVVM_View_Impl } from "@music-analyzer/view";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";
import { ReductionModel } from "../model";
import { ReductionViewModel } from "./reduction-view-model";
import { IRMSymbol } from "./irm-symbol";
import { Bracket } from "./bracket";
import { Dot } from "./dot";

export class ReductionView
  extends MVVM_View_Impl<"g", ReductionViewModel>
  implements TimeRangeSubscriber {
  readonly svg: SVGGElement;
  readonly bracket: Bracket;
  readonly dot: Dot;
  readonly ir_symbol: IRMSymbol;
  constructor(
    model: ReductionModel,
  ) {
    super("g", new ReductionViewModel(model));
    this.bracket = new Bracket(this.model);
    this.dot = new Dot(this.model);
    this.ir_symbol = new IRMSymbol(this.model);

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
  readonly setColor: SetColor = f => this.ir_symbol.setColor(f)
  onTimeRangeChanged() { this.model.onTimeRangeChanged() }
  onWindowResized() {
    this.model.onWindowResized();
    this.bracket.onWindowResized();
    this.dot.onWindowResized();
    this.ir_symbol.onWindowResized();
  }
}
