import { MVVM_View } from "@music-analyzer/view";
import { ReductionModel } from "../reduction";
import { ReductionViewModel } from "./reduction-view-model";
import { IRMSymbol } from "./irm-symbol";
import { Bracket } from "./bracket";
import { Dot } from "./dot";
import { ColorChangeSubscriber, hasArchetype, MelodyColorController } from "@music-analyzer/controllers";

export class ReductionView
  extends MVVM_View<ReductionViewModel, "g">
  implements
  ColorChangeSubscriber {
  readonly svg: SVGGElement;
  readonly bracket: Bracket;
  readonly dot: Dot;
  readonly ir_symbol: IRMSymbol;
  constructor(
    model: ReductionModel,
    controllers: [MelodyColorController],
  ) {
    const archetype = model.archetype;
    super(new ReductionViewModel(model), "g");
    this.bracket = new Bracket(this.model);
    this.dot = new Dot(this.model);
    this.ir_symbol = new IRMSymbol(this.model);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-node";
    this.svg.appendChild(this.bracket.svg);
    if (false) { this.svg.appendChild(this.dot.svg); }
    this.svg.appendChild(this.ir_symbol.svg);
    controllers[0].register(this);
  }
  get strong() { return this.model.strong; }
  set strong(value: boolean) {
    this.model.strong = value;
    this.bracket.updateStrong();
    this.dot.updateStrong();
  }
  setColor(getColor: (e: hasArchetype) => string) { this.ir_symbol.setColor(getColor); }
  updateColor() { this.ir_symbol.updateColor(); }
  onWindowResized() {
    this.model.onWindowResized();
    this.bracket.onWindowResized();
    this.dot.onWindowResized();
    this.ir_symbol.onWindowResized();
  }
}
