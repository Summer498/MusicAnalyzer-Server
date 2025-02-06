import { Archetype, get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { TSRModel } from "./tsr-tree-model";
import { black_key_prm, bracket_hight, CurrentTimeX, NoteSize, NowAtX } from "@music-analyzer/view-parameters";
import { MVCView } from "@music-analyzer/view";

export class TSRView extends MVCView {
  protected readonly model: TSRModel;
  readonly svg: SVGGElement;
  readonly bracket: SVGPathElement;
  readonly circle: SVGCircleElement;
  readonly ir_symbol: SVGTextElement;
  readonly archetype: Archetype;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  #strong: boolean;
  constructor(model: TSRModel, implication_realization: Archetype) {
    super();
    this.model = model;

    this.bracket = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.bracket.id = "group";
    this.bracket.style.stroke = "#004";
    this.bracket.style.strokeWidth = String(3);
    this.bracket.style.fill = "#eee";
    this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.circle.id = "head";
    this.circle.style.stroke = "#c00";
    this.circle.style.fill = "#c00";

    this.ir_symbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.ir_symbol.textContent = implication_realization.symbol;
    this.ir_symbol.id = "I-R Symbol";
    this.ir_symbol.style.fontFamily = "Times New Roman";
    this.ir_symbol.style.fontSize = `${bracket_hight}em`;
    this.ir_symbol.style.textAnchor = "middle";
    this.archetype = implication_realization;

    this.y = (2 + this.model.layer) * black_key_prm.height * bracket_hight;
    this.w = model.end - model.begin;
    this.h = black_key_prm.height * bracket_hight;

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-node";
    this.svg.appendChild(this.bracket);
    //    this.svg.appendChild(this.circle);
    this.svg.appendChild(this.ir_symbol);
    this.#strong = false;
  }
  updateBracket(x: number, y: number, w: number, h: number) {
    const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
    const ct11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
    const ct12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const ct21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const ct22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
    const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
    this.bracket.setAttribute("d", `M${begin.x} ${begin.y}C${ct11.x} ${ct11.y} ${ct12.x} ${ct12.y} ${corner1.x} ${corner1.y}L${corner2.x} ${corner2.y}C${ct21.x} ${ct21.y} ${ct22.x} ${ct22.y} ${end.x} ${end.y}`);
  }
  updateCircle(cx: number, cy: number) {
    this.circle.style.cx = String(cx);
    this.circle.style.cy = String(cy);
  }
  updateIRSymbol(cx: number, w: number, h: number) {
    this.ir_symbol.setAttribute("x", String(cx));
    this.ir_symbol.setAttribute("y", `${this.y}`);
    this.ir_symbol.style.fontSize = `${Math.min(w / h, bracket_hight)}em`;
    if (0) {
      this.ir_symbol.style.fill = this.archetype.color || "#000";
    }
    this.ir_symbol.style.fill = get_color_of_Narmour_concept(this.archetype) || "#000";
  }
  onAudioUpdate() {
    //    const is_just_layer = String(this.model.layer) === this.model.hierarchy_level.range.value;
    const x = CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value;
    const y = this.y;
    const w = this.w * NoteSize.value;
    const h = this.h;

    const cw = this.model.head.w * NoteSize.value;
    const cx = CurrentTimeX.value + this.model.head.begin * NoteSize.value - NowAtX.value + cw / 2;
    const cy = this.y - this.h;

    this.updateBracket(x, y, w, h);
    this.updateCircle(cx, cy);
    this.updateIRSymbol(cx, w, h);
  }
  get strong() { return this.#strong; }
  set strong(value: boolean) {
    this.#strong = value;
    this.bracket.style.strokeWidth = this.#strong ? "3" : "1";
    this.circle.style.r = String(this.#strong ? 5 : 3);
  }
}