import { Archetype, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale } from "@music-analyzer/irm";
import { bracket_hight } from "@music-analyzer/view-parameters";
import { MVCView } from "@music-analyzer/view";
import { get_color_of_implication_realization, get_color_on_intervallic_angle, get_color_on_parametric_scale, get_color_on_registral_scale } from "@music-analyzer/irm/src/colors.ts";
import { ReductionViewModel } from "./reduction-view-model";

export class IRMSymbolOnReduction extends MVCView {
  readonly svg: SVGTextElement;
  constructor(
    readonly model: ReductionViewModel,
    readonly archetype: Archetype,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${bracket_hight}em`;
    this.svg.style.textAnchor = "middle";
  }
  colorFunction(getColor: (archetype: Archetype) => string) {
    this.svg.style.fill = getColor(this.archetype) || "rgb(0, 0, 0)";
  }
  updateColor() {
    this.colorFunction(get_color_of_Narmour_concept);
    if (false) {
      this.colorFunction(get_color_on_parametric_scale);
      this.colorFunction(get_color_of_implication_realization);
      this.colorFunction(get_color_on_digital_parametric_scale);
      this.colorFunction(get_color_on_digital_parametric_scale);
      this.colorFunction(get_color_on_digital_intervallic_scale);
      this.colorFunction(get_color_on_intervallic_angle);
      this.colorFunction(get_color_on_registral_scale);
    }
  }
  update(cx: number, y: number, w: number, h: number) {
    this.svg.setAttribute("x", String(cx));
    this.svg.setAttribute("y", String(y));
    this.svg.style.fontSize = `${Math.min(w / h, bracket_hight)}em`;
    this.updateColor();
  }
  onWindowResized() {
    this.update(this.model.cx, this.model.y, this.model.w, this.model.h);
  }
}
