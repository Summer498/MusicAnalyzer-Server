import { ReductionViewModel } from "./reduction-view-model";
import { IRMSymbol } from "./irm-symbol";
import { Bracket } from "./bracket";
import { Dot } from "./dot";
import { ReductionModel } from "../reduction-model";
import { ColorChangeable } from "../../color-changeable";

export class ReductionView
  extends ColorChangeable<"g"> {
  readonly bracket: Bracket;
  readonly dot: Dot;
  readonly ir_symbol: IRMSymbol;
  protected readonly model: ReductionViewModel;
  constructor(
    model: ReductionModel,
  ) {
    super("g");
    this.model = new ReductionViewModel(model);
    this.bracket = new Bracket(this.model);
    this.dot = new Dot(this.model);
    this.ir_symbol = new IRMSymbol(this.model);

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
  onTimeRangeChanged() { this.model.onTimeRangeChanged() }
  onWindowResized() {
    this.model.onWindowResized();
    this.bracket.onWindowResized();
    this.dot.onWindowResized();
    this.ir_symbol.onWindowResized();
  }
}
