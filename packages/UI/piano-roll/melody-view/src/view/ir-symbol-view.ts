import { size } from "@music-analyzer/view-parameters";
import { IRSymbolModel } from "../model";
import { ColorChangeable } from "./color-changeable";

const ir_analysis_em = size;

export class IRSymbolView
  extends ColorChangeable<"text"> {
  constructor(
    protected readonly model: IRSymbolModel,
  ) {
    super("text");
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${ir_analysis_em}em`;
    this.svg.style.textAnchor = "middle";
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}
