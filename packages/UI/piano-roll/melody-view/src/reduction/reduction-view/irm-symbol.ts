import { bracket_height } from "@music-analyzer/view-parameters";
import { ReductionViewModel } from "./reduction-view-model";
import { ColorChangeable } from "../../color-changeable";

export class IRMSymbol
  extends ColorChangeable<"text"> {
  constructor(
    protected readonly model: ReductionViewModel,
  ) {
    super("text");
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${bracket_height}em`;
    this.svg.style.textAnchor = "middle";
  }
  update(cx: number, y: number, w: number, h: number) {
    this.svg.setAttribute("x", String(cx));
    this.svg.setAttribute("y", String(y));
    this.svg.style.fontSize = `${Math.min(w / h, bracket_height)}em`;
  }
  onWindowResized() {
    this.update(this.model.cx, this.model.y, this.model.w, this.model.h);
  }
}
