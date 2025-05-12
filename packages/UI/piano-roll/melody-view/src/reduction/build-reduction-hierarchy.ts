import { IHierarchyBuilder } from "../i-hierarchy-builder";
import { RequiredByReductionHierarchy } from "./required-by-reduction-hierarchy";
import { Hierarchy, Layer, Model, Part, View } from "../abstract/abstract-hierarchy";
import { ColorChangeable } from "../color-changeable";
import { SetColor } from "@music-analyzer/controllers";
import { Triad } from "@music-analyzer/irm";
import { black_key_height, bracket_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

class ReductionModel
  extends Model {
  readonly archetype: Triad;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    readonly layer: number,
  ) {
    super(e.time,e.head);
    this.archetype = e.melody_analysis.implication_realization as Triad;
  }
}

class ReductionViewModel {
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
  readonly archetype: Triad;
  constructor(
    readonly model: ReductionModel,
  ) {
    this.#x = this.getViewX(this.model.time.begin);
    this.#w = this.getViewW(this.model.time.duration);
    this.#cw = this.getViewW(this.model.head.duration);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
    this.y = PianoRollConverter.convertToCoordinate((2 + this.model.layer)) * bracket_height;
    this.h = black_key_height * bracket_height;
    this.#strong = false;
    this.archetype = model.archetype as Triad
  }
  getViewX(x: number) { return PianoRollConverter.scaled(x); }
  getViewW(w: number) { return PianoRollConverter.scaled(w); }
  updateX() {
    this.#x = this.getViewX(this.model.time.begin);
    this.#cx = this.getViewX(this.model.head.begin) + this.#cw / 2;
  }
  updateWidth() {
    this.#w = this.getViewW(this.model.time.duration);
    this.#cw = this.getViewW(this.model.head.duration);
  }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
  }
  onTimeRangeChanged = this.onWindowResized;
}

class IRMSymbol
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

class Bracket 
  extends View<"path"> {
  private readonly model: ReductionViewModel
  readonly svg: SVGPathElement;
  constructor(model: ReductionViewModel) {
    super("path");
    this.model = model
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

class Dot 
  extends View<"circle"> {
  constructor(
    readonly model: ReductionViewModel,
  ) {
    super("circle");
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

class ReductionView
  extends ColorChangeable<"g"> {
  readonly bracket: Bracket;
  readonly dot: Dot;
  readonly ir_symbol: IRMSymbol;
  protected readonly model: ReductionViewModel;
  constructor(
    model: ReductionModel,
  ) {
    super("g");
    this.model = new ReductionViewModel(model);
    this.bracket = new Bracket(this.model);
    this.dot = new Dot(this.model);
    this.ir_symbol = new IRMSymbol(this.model);

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
  onTimeRangeChanged() { this.onWindowResized() }
  onWindowResized() {
    this.model.onWindowResized();
    this.bracket.onWindowResized();
    this.dot.onWindowResized();
    this.ir_symbol.onWindowResized();
  }
}


class Reduction
  extends Part<ReductionModel, ReductionView> {
  constructor(
    model: ReductionModel,
    view: ReductionView,
  ) {
    super(model, view);
  }
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
  renewStrong(strong: boolean) { this.view.strong = strong; }
  onTimeRangeChanged() { this.view.onTimeRangeChanged() }
  onWindowResized() { this.view.onWindowResized() }
}

class ReductionLayer
  extends Layer<Reduction> {
  constructor(
    children: Reduction[],
    layer: number,
  ) {
    super(layer, children);
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

export class ReductionHierarchy
  extends Hierarchy<ReductionLayer> {
  constructor(
    children: ReductionLayer[],
    controllers: RequiredByReductionHierarchy
  ) {
    super("time-span-reduction", children);
    controllers.melody_color.addListeners(this.setColor.bind(this));
    controllers.hierarchy.addListeners(this.onChangedLayer.bind(this));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this))
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value >= e.layer);
    this.show.forEach(e => e.renewStrong(value));
    visible_layer.forEach(e => e.renewStrong(value));
    this.setShow(visible_layer);
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
}

export function buildReduction(this: IHierarchyBuilder) {
  const layer = this.h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new ReductionModel(e, l);
      const view = new ReductionView(model);
      return new Reduction(model, view)
    });
    return new ReductionLayer(parts, l)
  })
  return new ReductionHierarchy(layer, this.controllers);
}
