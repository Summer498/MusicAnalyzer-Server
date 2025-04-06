import { size } from "@music-analyzer/view-parameters";
import { MVVM_View_Impl } from "@music-analyzer/view";
import { ColorChangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";
import { IRSymbolModel } from "../model/ir-symbol-model";

const ir_analysis_em = size;

export class IRSymbolView
  extends MVVM_View_Impl<"text", IRSymbolModel>
  implements ColorChangeSubscriber {
  constructor(
    model: IRSymbolModel,
  ) {
    super("text", model);
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${ir_analysis_em}em`;
    this.svg.style.textAnchor = "middle";
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  readonly setColor: SetColor = getColor => this.svg.style.fill = getColor(this.model.archetype) || "rgb(0, 0, 0)";
}
