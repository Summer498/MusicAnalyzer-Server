import { get_color_of_Narmour_concept, Triad } from "@music-analyzer/irm";
import { bracket_height } from "@music-analyzer/view-parameters";
import { MVVM_View } from "@music-analyzer/view";
import { ReductionViewModel } from "./reduction-view-model";
import { MelodyColorController } from "@music-analyzer/controllers";

export interface RequiredByIRMSymbol {
  readonly melody_color: MelodyColorController
}
export class IRMSymbol
  extends MVVM_View<ReductionViewModel, "text"> {
  #getColor: (e: Triad) => string;
  constructor(
    model: ReductionViewModel,
    controllers: RequiredByIRMSymbol,
  ) {
    super("text", model);
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${bracket_height}em`;
    this.svg.style.textAnchor = "middle";
    this.#getColor = get_color_of_Narmour_concept;
    controllers.melody_color.register(this);
  }
  setColor(getColor: (e: Triad) => string) {
    this.#getColor = getColor;
    this.svg.style.fill = this.#getColor(this.model.archetype) || "rgb(0, 0, 0)";
  }
  updateColor() {
    this.svg.style.fill = this.#getColor(this.model.archetype) || "rgb(0, 0, 0)";
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
