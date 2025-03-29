import { bracket_height } from "@music-analyzer/view-parameters/src/bracket-height";
import { MVVM_View_Impl } from "@music-analyzer/view/src/mvvm/view-impl";
import { ReductionViewModel } from "./reduction-view-model";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";

export class IRMSymbol
  extends MVVM_View_Impl<"text", ReductionViewModel> {
  constructor(
    model: ReductionViewModel,
  ) {
    super("text", model);
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${bracket_height}em`;
    this.svg.style.textAnchor = "middle";
  }
  readonly setColor: SetColor = getColor => this.svg.style.fill = getColor(this.model.archetype) || "rgb(0, 0, 0)";
  update(cx: number, y: number, w: number, h: number) {
    this.svg.setAttribute("x", String(cx));
    this.svg.setAttribute("y", String(y));
    this.svg.style.fontSize = `${Math.min(w / h, bracket_height)}em`;
  }
  onWindowResized() {
    this.update(this.model.cx, this.model.y, this.model.w, this.model.h);
  }
}
