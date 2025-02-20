import { BlackKeyPrm, NoteSize, PianoRollBegin, Size } from "@music-analyzer/view-parameters";
import { IRSymbolModel } from "./ir-symbol-model";
import { get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale, get_color_on_parametric_scale } from "@music-analyzer/irm";
import { MVCView } from "@music-analyzer/view";

const ir_analysis_em = Size.value;

export class IRSymbolView extends MVCView {
  protected readonly model: IRSymbolModel;
  readonly svg: SVGTextElement;
  readonly y: number;
  constructor(model: IRSymbolModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${ir_analysis_em}em`;
    this.svg.style.textAnchor = "middle";
    this.svg.style.fill = get_color_on_digital_intervallic_scale(this.model.archetype) || "#000";
    if (false) {
      this.svg.style.fill = get_color_of_Narmour_concept(this.model.archetype) || "#000";
      this.svg.style.fill = get_color_on_digital_parametric_scale(this.model.archetype) || "#000";
      this.svg.style.fill = get_color_on_parametric_scale(this.model.archetype) || "#000";
      this.svg.style.fill = this.model.archetype.color || "#000";
    }
    this.y = isNaN(this.model.note) ? -99 : (PianoRollBegin.value - this.model.note) * BlackKeyPrm.height;
    this.updateX();
    this.updateY();
  }
  updateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value + this.model.duration * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  onWindowResized() {
    this.updateX();
  }
}
