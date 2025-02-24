import { Archetype, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale } from "@music-analyzer/irm";
import { BlackKeyPrm, bracket_hight, NoteSize } from "@music-analyzer/view-parameters";
import { MVCView } from "@music-analyzer/view";
import { ReductionModel } from "./tsr-tree-model";
import { get_color_of_implication_realization } from "@music-analyzer/irm/src/colors.ts";

export class ReductionView extends MVCView {
  readonly svg: SVGGElement;
  readonly bracket: SVGPathElement;
  readonly circle: SVGCircleElement;
  readonly ir_symbol: SVGTextElement;
  #x: number;
  #w: number;
  #cx: number;
  #cw: number;
  readonly y: number;
  readonly h: number;
  #strong: boolean;
  constructor(
    protected readonly model: TSRModel,
    readonly archetype: Archetype,
  ) {
    super();
    this.bracket = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.bracket.id = "group";
    this.bracket.style.stroke = "rgb(0, 0, 64)";
    this.bracket.style.strokeWidth = String(3);
    this.bracket.style.fill = "rgb(242, 242, 242)";
    this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.circle.id = "head";
    this.circle.style.stroke = "rgb(192, 0, 0)";
    this.circle.style.fill = "rgb(192, 0, 0)";

    this.ir_symbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.ir_symbol.textContent = archetype.symbol;
    this.ir_symbol.id = "I-R Symbol";
    this.ir_symbol.style.fontFamily = "Times New Roman";
    this.ir_symbol.style.fontSize = `${bracket_hight}em`;
    this.ir_symbol.style.textAnchor = "middle";

    this.#x = this.getViewX(this.model.begin);
    this.#w = this.getViewW(this.model.duration);
    this.#cw = this.getViewW(this.model.head.duration);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
    this.y = (2 + this.model.layer) * BlackKeyPrm.height * bracket_hight;
    this.h = BlackKeyPrm.height * bracket_hight;

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-node";
    this.svg.appendChild(this.bracket);
    //    this.svg.appendChild(this.circle);
    this.svg.appendChild(this.ir_symbol);
    this.#strong = false;
    this.updateBracket(this.#x, this.y, this.#w, this.h);
    this.updateCircle(this.#cx, this.y - this.h);
    this.updateIRSymbol(this.#cx, this.y, this.#w, this.h);
  }
  getViewX(x: number) { return x * NoteSize.value; }
  getViewW(w: number) { return w * NoteSize.value; }
  updateBracket(x: number, y: number, w: number, h: number) {
    const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
    const ctrl11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
    const ctrl12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const ctrl21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const ctrl22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
    const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
    this.bracket.setAttribute("d",
      `M${begin.x} ${begin.y}`
      + `C${ctrl11.x} ${ctrl11.y}`
      + ` ${ctrl12.x} ${ctrl12.y}`
      + ` ${corner1.x} ${corner1.y}`
      + `L${corner2.x} ${corner2.y}`
      + `C${ctrl21.x} ${ctrl21.y}`
      + ` ${ctrl22.x} ${ctrl22.y}`
      + ` ${end.x} ${end.y}`
    );
  }
  updateCircle(cx: number, cy: number) {
    this.circle.style.cx = String(cx);
    this.circle.style.cy = String(cy);
  }
  updateIRSymbol(cx: number, y: number, w: number, h: number) {
    this.ir_symbol.setAttribute("x", String(cx));
    this.ir_symbol.setAttribute("y", String(y));
    this.ir_symbol.style.fontSize = `${Math.min(w / h, bracket_hight)}em`;
    this.ir_symbol.style.fill = get_color_of_Narmour_concept(this.archetype) || "rgb(0, 0, 0)";
    if (false) {
      this.ir_symbol.style.fill = get_color_of_implication_realization(this.archetype) || "rgb(0, 0, 0)";
      this.ir_symbol.style.fill = get_color_on_digital_parametric_scale(this.archetype) || "rgb(0, 0, 0)";
      this.ir_symbol.style.fill = get_color_on_digital_intervallic_scale(this.archetype) || "rgb(0, 0, 0)";
      this.ir_symbol.style.fill = this.archetype.color || "rgb(0, 0, 0)";
    }
  }
  get strong() { return this.#strong; }
  set strong(value: boolean) {
    this.#strong = value;
    this.bracket.style.strokeWidth = this.#strong ? "3" : "1";
    this.circle.style.r = String(this.#strong ? 5 : 3);
  }
  updateX() {
    this.#x = this.getViewX(this.model.begin);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
  }
  updateWidth() {
    this.#w = this.getViewW(this.model.duration);
    this.#cw = this.getViewW(this.model.head.duration);
  }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateBracket(this.#x, this.y, this.#w, this.h);
    this.updateCircle(this.#cx, this.y - this.h);
    this.updateIRSymbol(this.#cx, this.y, this.#w, this.h);
  }
}
