import { Triad } from "@music-analyzer/irm";
import { black_key_height, bracket_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { HierarchyLevelController, MelodyColorController, SetColor, TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";

class ReductionModel {
  readonly time: Time;
  readonly head: Time;
  readonly archetype: Triad;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    readonly layer: number,
  ) {
    this.time = e.time;
    this.head = e.head;
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
    this.#cx = this.getViewX(this.model.head.begin) + this.getViewW(this.model.head.duration) / 2;
    this.y = [this.model.layer]
      .map(e => e + 2)
      .map(e => PianoRollConverter.convertToCoordinate(e))
      .map(e => e * bracket_height)
    [0];
    this.h = black_key_height * bracket_height;
    this.#strong = false;
    this.archetype = model.archetype as Triad
  }
  getViewX(x: number) { return PianoRollConverter.scaled(x); }
  getViewW(w: number) { return PianoRollConverter.scaled(w); }
  updateX() {
    this.#x = this.getViewX(this.model.time.begin);
    this.#cx = this.getViewX(this.model.head.begin) + this.getViewW(this.model.head.duration) / 2;
  }
  updateWidth() {
    this.#w = this.getViewW(this.model.time.duration);
    this.#cw = this.getViewW(this.model.head.duration);
  }
  onWindowResized() {
    this.updateWidth();
    this.updateX();
    return this;
  }
  onTimeRangeChanged = this.onWindowResized;
}

class IRMSymbol {
  constructor(
    readonly svg: SVGTextElement,
  ) { }
  update(cx: number, y: number, w: number, h: number) {
    this.svg.setAttribute("x", String(cx));
    this.svg.setAttribute("y", String(y));
    this.svg.setAttribute("fontSize", `${Math.min(w / h, bracket_height)}em`)
  }
  onWindowResized(model: ReductionViewModel) {
    this.update(model.cx, model.y, model.w, model.h);
  }
  readonly setColor = (color: string) => this.svg.style.fill = color;
}

class Bracket {
  private readonly model: ReductionViewModel
  constructor(
    readonly svg: SVGPathElement,
    model: ReductionViewModel,
  ) {
    this.model = model
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
  onWindowResized(model: ReductionViewModel) {
    this.update(model.x, model.y, model.w, model.h);
  }
}

class Dot {
  constructor(
    readonly svg: SVGCircleElement,
    private readonly model: ReductionViewModel,
  ) { }
  updateStrong() {
    this.svg.style.r = String(this.model.strong ? 5 : 3);
  }
  update(cx: number, cy: number) {
    this.svg.setAttribute("cx", String(cx));
    this.svg.setAttribute("cy", String(cy));
  }
  onWindowResized(model: ReductionViewModel) {
    this.update(model.cx, model.y - model.h);
  }
}

class ReductionView {
  constructor(
    readonly svg: SVGGElement,
    readonly bracket: Bracket,
    readonly dot: Dot,
    readonly ir_symbol: IRMSymbol,
    readonly model: ReductionViewModel,
  ) { }
  get strong() { return this.model.strong; }
  set strong(value: boolean) {
    this.model.strong = value;
    this.bracket.updateStrong();
    this.dot.updateStrong();
  }
  onTimeRangeChanged() { this.onWindowResized() }
  onWindowResized() {
    const model = this.model.onWindowResized();
    this.bracket.onWindowResized(model);
    this.dot.onWindowResized(model);
    this.ir_symbol.onWindowResized(model);
  }
  readonly setColor = (color: string) => this.svg.style.fill = color;
}

class Reduction {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: ReductionModel,
    readonly view: ReductionView,
  ) { }
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
  renewStrong(strong: boolean) { this.view.strong = strong; }
  onTimeRangeChanged() { this.view.onTimeRangeChanged() }
  onWindowResized() { this.view.onWindowResized() }
}

class ReductionLayer {
  readonly children_model: { readonly time: Time }[];
  #show: Reduction[];
  get show() { return this.#show; };
  constructor(
    readonly svg: SVGGElement,
    readonly children: Reduction[],
    readonly layer: number,
  ) {
    this.children_model = this.children.map(e => e.model);
    this.#show = children;
  }
  renewStrong(layer: number) { this.children.forEach(e => e.renewStrong(layer === this.layer)); }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}

class ReductionHierarchy {
  protected _show: ReductionLayer[] = [];
  private get show() { return this._show; }
  constructor(
    readonly svg: SVGGElement,
    readonly children: ReductionLayer[],
  ) { }
  setShow(visible_layers: ReductionLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value >= e.layer);
    this.show.forEach(e => e.renewStrong(value));
    visible_layer.forEach(e => e.renewStrong(value));
    this.setShow(visible_layer);
  }
}

function getReductionSVG(
  bracket: Bracket,
  dot: { svg: SVGElement },
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = "time-span-node";
  svg.appendChild(bracket.svg);
  svg.appendChild(dot.svg);
  return svg;
}

function getIRMSymbolSVG(
  model: ReductionModel
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "text")
  svg.textContent = model.archetype.symbol;
  svg.id = "I-R Symbol";
  svg.style.fontFamily = "Times New Roman";
  svg.style.fontSize = `${bracket_height}em`;
  svg.style.textAnchor = "middle";
  return svg;
}

function getIntervalSVG(
  model: ReductionModel
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "text")
  const I = model.archetype.intervals
  svg.textContent = I && I.length > 1 && I[1] || "";  // NOTE: 0 のほうが良いかもしれない
  svg.id = "interval";
  svg.style.fontFamily = "Times New Roman";
  svg.style.fontSize = `${bracket_height/2}em`;
  svg.style.textAnchor = "middle";
  return svg;
}

function getBracketSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.id = "group";
  svg.style.stroke = "rgb(0, 0, 64)";
  svg.style.strokeWidth = String(3);
  svg.style.fill = "rgb(242, 242, 242)";
  return svg;
}

function getDotSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  svg.id = "head";
  svg.style.stroke = "rgb(192, 0, 0)";
  svg.style.fill = "rgb(192, 0, 0)";
  return svg;
}

function getSVGG(id: string, children: { svg: SVGGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));
  return svg;
}

export function buildReduction(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
  }
) {
  const layer = h_melodies.map((e, l) => {
    const parts = e.map(e => {
      const model = new ReductionModel(e, l);

      const view_model = new ReductionViewModel(model);
      const bracket_svg = getBracketSVG();
      const bracket = new Bracket(bracket_svg, view_model);
      const dot_svg = getDotSVG();
      const dot = new Dot(dot_svg, view_model);
      const svg_irm_symbol = getIRMSymbolSVG(model);
      const svg_interval = getIntervalSVG(model);
      const ir_symbol = new IRMSymbol(svg_irm_symbol);
      const interval = new IRMSymbol(svg_interval);
      // const svg = getReductionSVG(bracket, dot);
      // const svg = getReductionSVG(bracket, ir_symbol);
      const svg = getReductionSVG(bracket, interval);
      //      const view = new ReductionView(svg, bracket, dot, ir_symbol, view_model);
      const view = new ReductionView(svg, bracket, dot, interval, view_model);
      return new Reduction(model, view)
    });
    const svg = getSVGG(`layer-${l}`, parts);
    return new ReductionLayer(svg, parts, l)
  })
  const svg = getSVGG("time-span-reduction", layer);
  const time_span_tree = new ReductionHierarchy(svg, layer);

  controllers.window.addListeners(...time_span_tree.children.flatMap(e => e.children).map(e => e.onWindowResized.bind(e)));
  controllers.hierarchy.addListeners(time_span_tree.onChangedLayer.bind(time_span_tree));
  controllers.time_range.addListeners(...time_span_tree.children.flatMap(e => e.children).map(e => e.onTimeRangeChanged.bind(e)));
  controllers.melody_color.addListeners(...time_span_tree.children.flatMap(e => e.children).map(e => e.setColor.bind(e)));
  controllers.audio.addListeners(...time_span_tree.children.map(e => e.onAudioUpdate.bind(e)));
  time_span_tree.children.map(e => e.onAudioUpdate());

  return time_span_tree.svg
}
