import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { bracket_height } from "@music-analyzer/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { ReductionViewModel } from "./reduction-view-model";

export class IRMSymbolOnReduction extends MVVM_View<ReductionViewModel, "text"> {
  #getColor: (archetype: Archetype) => string;
  constructor(
    model: ReductionViewModel,
    readonly archetype: Archetype,
  ) {
    super(model, "text");
    this.svg.textContent = archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${bracket_height}em`;
    this.svg.style.textAnchor = "middle";
    this.#getColor = get_color_of_Narmour_concept;
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.#getColor = getColor;
    this.svg.style.fill = this.#getColor(this.archetype) || "rgb(0, 0, 0)";
  }
  updateColor(){
    this.svg.style.fill = this.#getColor(this.archetype) || "rgb(0, 0, 0)";
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
