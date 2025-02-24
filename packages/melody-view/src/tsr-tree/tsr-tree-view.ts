import { Archetype, get_color_of_Narmour_concept, get_color_on_digital_intervallic_scale, get_color_on_digital_parametric_scale } from "@music-analyzer/irm";
import { BlackKeyPrm, bracket_hight, NoteSize } from "@music-analyzer/view-parameters";
import { MVCModel, MVCView } from "@music-analyzer/view";
import { ReductionModel } from "./tsr-tree-model";
import { get_color_of_implication_realization } from "@music-analyzer/irm/src/colors.ts";

class ReductionViewModel extends MVCModel {
  #x: number;
  #w: number;
  #cx: number;
  #cw: number;
  #strong: boolean;
  readonly y: number;
  readonly h: number;
  get x() { return this.#x; }
  get w() { return this.#w; }
  get cx() { return this.#cx; }
  get cw() { return this.#cw; }
  get strong() { return this.#strong; }
  set strong(value: boolean) { this.#strong = value; }
  constructor(
    readonly model: ReductionModel,
  ) {
    super();
    this.#x = this.getViewX(this.model.begin);
    this.#w = this.getViewW(this.model.duration);
    this.#cw = this.getViewW(this.model.head.duration);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
    this.y = (2 + this.model.layer) * BlackKeyPrm.height * bracket_hight;
    this.h = BlackKeyPrm.height * bracket_hight;
    this.#strong = false;
  }
  getViewX(x: number) { return x * NoteSize.value; }
  getViewW(w: number) { return w * NoteSize.value; }
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
  }
}

export class ReductionBracket extends MVCView {
  readonly svg: SVGPathElement;
  constructor(
    readonly model: ReductionViewModel,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.svg.id = "group";
    this.svg.style.stroke = "rgb(0, 0, 64)";
    this.svg.style.strokeWidth = String(3);
    this.svg.style.fill = "rgb(242, 242, 242)";
  }
  updateStrong() {
    this.svg.style.strokeWidth = this.model.strong ? "3" : "1";
  }
  update(x: number, y: number, w: number, h: number) {
    const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
    const ctrl11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
    const ctrl12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const ctrl21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const ctrl22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
    const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
    this.svg.setAttribute("d",
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
  onWindowResized() {
    this.update(this.model.x, this.model.y, this.model.w, this.model.h);
  }
}

export class ReductionDot extends MVCView {
  readonly svg: SVGCircleElement;
  constructor(
    readonly model: ReductionViewModel,
  ) {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.svg.id = "head";
    this.svg.style.stroke = "rgb(192, 0, 0)";
    this.svg.style.fill = "rgb(192, 0, 0)";
  }
  updateStrong() {
    this.svg.style.r = String(this.model.strong ? 5 : 3);
  }
  update(cx: number, cy: number) {
    this.svg.style.cx = String(cx);
    this.svg.style.cy = String(cy);
  }
  onWindowResized() {
    this.update(this.model.cx, this.model.y - this.model.h);
  }
}

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
  updateColor() {
    this.svg.style.fill = get_color_of_Narmour_concept(this.archetype) || "rgb(0, 0, 0)";
    if (false) {
      this.svg.style.fill = get_color_of_implication_realization(this.archetype) || "rgb(0, 0, 0)";
      this.svg.style.fill = get_color_on_digital_parametric_scale(this.archetype) || "rgb(0, 0, 0)";
      this.svg.style.fill = get_color_on_digital_intervallic_scale(this.archetype) || "rgb(0, 0, 0)";
      this.svg.style.fill = this.archetype.color || "rgb(0, 0, 0)";
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

export class ReductionView extends MVCView {
  readonly svg: SVGGElement;
  readonly model: ReductionViewModel;
  readonly bracket: ReductionBracket;
  readonly dot: ReductionDot;
  readonly ir_symbol: IRMSymbolOnReduction;
  constructor(
    model: ReductionModel,
    readonly archetype: Archetype,
  ) {
    super();
    this.model = new ReductionViewModel(model);
    this.bracket = new ReductionBracket(this.model);
    this.dot = new ReductionDot(this.model);
    this.ir_symbol = new IRMSymbolOnReduction(this.model, archetype);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-node";
    this.svg.appendChild(this.bracket.svg);
    if (false) { this.svg.appendChild(this.dot.svg); }
    this.svg.appendChild(this.ir_symbol.svg);
  }
  get strong() { return this.model.strong; }
  set strong(value: boolean) {
    this.model.strong = value;
    this.bracket.updateStrong();
    this.dot.updateStrong();
  }
  updateColor() {
    this.ir_symbol.updateColor();
  }
  onWindowResized() {
    this.model.onWindowResized();
    this.bracket.onWindowResized();
    this.dot.onWindowResized();
    this.ir_symbol.onWindowResized();
  }
}
