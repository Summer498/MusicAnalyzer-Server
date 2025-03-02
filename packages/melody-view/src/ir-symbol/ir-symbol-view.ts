import { BlackKeyPrm, NoteSize, PianoRollBegin, Size } from "@music-analyzer/view-parameters";
import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { MVVM_View } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";

const ir_analysis_em = Size.value;

export class IRSymbolView extends MVVM_View {
  readonly svg: SVGTextElement;
  readonly y: number;
  #getColor: (archetype: Archetype) => string;
  constructor(
    protected readonly model: IRSymbolModel,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.svg.textContent = this.model.archetype.symbol;
    this.svg.id = "I-R Symbol";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${ir_analysis_em}em`;
    this.svg.style.textAnchor = "middle";
    this.y = isNaN(this.model.note) ? -99 : (PianoRollBegin.value - this.model.note) * BlackKeyPrm.height;
    this.updateX();
    this.updateY();
    this.#getColor = get_color_of_Narmour_concept;
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.#getColor = getColor;
    this.svg.style.fill = this.#getColor(this.model.archetype) || "rgb(0, 0, 0)";
  }
  updateColor(){
    this.#getColor(this.model.archetype) || "rgb(0, 0, 0)";
  }
  updateX() { this.svg.setAttribute("x", String(this.model.begin * NoteSize.value + this.model.duration / 2 * NoteSize.value)); }
  updateY() { this.svg.setAttribute("y", String(this.y)); }
  onWindowResized() {
    this.updateX();
  }
}
