import { size } from "@music-analyzer/view-parameters";
import { Triad } from "@music-analyzer/irm";
import { MVVM_View } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { ColorChangeSubscriber, MelodyColorController } from "@music-analyzer/controllers";

const ir_analysis_em = size;

export interface RequiredByIRSymbolView {
  readonly melody_color: MelodyColorController
}

export class IRSymbolView
  extends MVVM_View<"text", IRSymbolModel>
  implements
  ColorChangeSubscriber {
  constructor(
    model: IRSymbolModel,
    controllers: RequiredByIRSymbolView,
  ) {
    super("text", model);
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${ir_analysis_em}em`;
    this.svg.style.textAnchor = "middle";
    controllers.melody_color.register(this)
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  setColor(getColor: (e: Triad) => string) {
    this.svg.style.fill = getColor(this.model.archetype) || "rgb(0, 0, 0)";
  }
}
