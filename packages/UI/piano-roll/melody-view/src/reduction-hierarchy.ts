import { ITriad } from "@music-analyzer/irm";
import { black_key_height, bracket_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { HierarchyLevelController, MelodyColorController, SetColor, TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";

interface ReductionModel { readonly time: Time; readonly head: Time; readonly archetype: ITriad; readonly layer: number }
const createReductionModel = (e: SerializedTimeAndAnalyzedMelody, layer: number): ReductionModel => ({
  time: e.time,
  head: e.head,
  archetype: e.melody_analysis.implication_realization as ITriad,
  layer,
});

interface ReductionViewModel {
  readonly model: ReductionModel;
  readonly y: number;
  readonly h: number;
  x: number;
  w: number;
  cx: number;
  cw: number;
  strong: boolean;
  readonly archetype: ITriad;
  onWindowResized: () => ReductionViewModel;
  onTimeRangeChanged: () => ReductionViewModel;
}
const createReductionViewModel = (model: ReductionModel): ReductionViewModel => {
  let x = PianoRollConverter.scaled(model.time.begin);
  let w = PianoRollConverter.scaled(model.time.duration);
  let cw = PianoRollConverter.scaled(model.head.duration);
  let cx = PianoRollConverter.scaled(model.head.begin) + cw / 2;
  const y = PianoRollConverter.convertToCoordinate(model.layer + 2) * bracket_height;
  const h = black_key_height * bracket_height;
  let strong = false;
  const getViewX = (v: number) => PianoRollConverter.scaled(v);
  const getViewW = (v: number) => PianoRollConverter.scaled(v);
  const updateX = () => {
    x = getViewX(model.time.begin);
    cx = getViewX(model.head.begin) + getViewW(model.head.duration) / 2;
  };
  const updateWidth = () => {
    w = getViewW(model.time.duration);
    cw = getViewW(model.head.duration);
  };
  const onWindowResized = () => { updateWidth(); updateX(); return vm; };
  const vm: ReductionViewModel = {
    model,
    get y() { return y; },
    get h() { return h; },
    get x() { return x; },
    get w() { return w; },
    get cx() { return cx; },
    get cw() { return cw; },
    get strong() { return strong; },
    set strong(v: boolean) { strong = v; },
    archetype: model.archetype as ITriad,
    onWindowResized,
    onTimeRangeChanged: onWindowResized,
  };
  return vm;
};

interface IRMSymbol {
  readonly svg: SVGTextElement;
  update: (cx: number, y: number, w: number, h: number) => void;
  onWindowResized: (model: ReductionViewModel) => void;
  setColor: (color: string) => void;
}
const createIRMSymbol = (svg: SVGTextElement): IRMSymbol => ({
  svg,
  update: (cx, y, w, h) => {
    svg.setAttribute("x", String(cx));
    svg.setAttribute("y", String(y));
    svg.setAttribute("fontSize", `${Math.min(w / h, bracket_height)}em`);
  },
  onWindowResized: (model) => {
    svg.setAttribute("x", String(model.cx));
    svg.setAttribute("y", String(model.y));
    svg.setAttribute("fontSize", `${Math.min(model.w / model.h, bracket_height)}em`);
  },
  setColor: (color) => { svg.style.fill = color; },
});

interface Bracket {
  readonly svg: SVGPathElement;
  updateStrong: () => void;
  update: (x: number, y: number, w: number, h: number) => void;
  onWindowResized: (model: ReductionViewModel) => void;
}
const createBracket = (svg: SVGPathElement, model: ReductionViewModel): Bracket => ({
  svg,
  updateStrong: () => { svg.style.strokeWidth = model.strong ? "3" : "1"; },
  update: (x, y, w, h) => {
    const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
    const ctrl11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
    const ctrl12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
    const ctrl21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
    const ctrl22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
    const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
    svg.setAttribute("d",
      `M${begin.x} ${begin.y}`
      + `C${ctrl11.x} ${ctrl11.y}`
      + ` ${ctrl12.x} ${ctrl12.y}`
      + ` ${corner1.x} ${corner1.y}`
      + `L${corner2.x} ${corner2.y}`
      + `C${ctrl21.x} ${ctrl21.y}`
      + ` ${ctrl22.x} ${ctrl22.y}`
      + ` ${end.x} ${end.y}`
    );
  },
  onWindowResized: (m) => { svg.setAttribute("d", ""); createBracket(svg, m).update(m.x, m.y, m.w, m.h); },
});

interface Dot {
  readonly svg: SVGCircleElement;
  updateStrong: () => void;
  update: (cx: number, cy: number) => void;
  onWindowResized: (model: ReductionViewModel) => void;
}
const createDot = (svg: SVGCircleElement, model: ReductionViewModel): Dot => ({
  svg,
  updateStrong: () => { svg.style.r = String(model.strong ? 5 : 3); },
  update: (cx, cy) => { svg.setAttribute("cx", String(cx)); svg.setAttribute("cy", String(cy)); },
  onWindowResized: (m) => { svg.setAttribute("cx", String(m.cx)); svg.setAttribute("cy", String(m.y - m.h)); },
});

interface ReductionView {
  readonly svg: SVGGElement;
  readonly bracket: Bracket;
  readonly dot: Dot;
  readonly ir_symbol: IRMSymbol;
  readonly model: ReductionViewModel;
  strong: boolean;
  onTimeRangeChanged: () => void;
  onWindowResized: () => void;
  setColor: (color: string) => void;
}
const createReductionView = (
  svg: SVGGElement,
  bracket: Bracket,
  dot: Dot,
  ir_symbol: IRMSymbol,
  model: ReductionViewModel,
): ReductionView => {
  const view: ReductionView = {
    svg,
    bracket,
    dot,
    ir_symbol,
    model,
    get strong() { return model.strong; },
    set strong(value: boolean) {
      model.strong = value;
      bracket.updateStrong();
      dot.updateStrong();
    },
    onTimeRangeChanged() { view.onWindowResized(); },
    onWindowResized() {
      const m = model.onWindowResized();
      bracket.onWindowResized(m);
      dot.onWindowResized(m);
      ir_symbol.onWindowResized(m);
    },
    setColor: (color) => { svg.style.fill = color; },
  };
  return view;
};

interface Reduction {
  readonly model: ReductionModel;
  readonly view: ReductionView;
  readonly svg: SVGGElement;
  setColor: SetColor;
  renewStrong: (strong: boolean) => void;
  onTimeRangeChanged: () => void;
  onWindowResized: () => void;
}
const createReduction = (model: ReductionModel, view: ReductionView): Reduction => ({
  model,
  view,
  get svg() { return view.svg; },
  setColor: (f) => view.setColor(f(model.archetype)),
  renewStrong: (s) => { view.strong = s; },
  onTimeRangeChanged: () => view.onTimeRangeChanged(),
  onWindowResized: () => view.onWindowResized(),
});

interface ReductionLayer {
  readonly svg: SVGGElement;
  readonly children: Reduction[];
  readonly layer: number;
  readonly children_model: { readonly time: Time }[];
  readonly show: Reduction[];
  renewStrong: (layer: number) => void;
  onAudioUpdate: () => void;
}
const createReductionLayer = (svg: SVGGElement, children: Reduction[], layer: number): ReductionLayer => {
  const children_model = children.map(e => e.model);
  const show = children;
  return {
    svg,
    children,
    layer,
    children_model,
    get show() { return show; },
    renewStrong: (l) => { children.forEach(e => e.renewStrong(l === layer)); },
    onAudioUpdate: () => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); },
  };
};

interface ReductionHierarchy {
  readonly svg: SVGGElement;
  readonly children: ReductionLayer[];
  _show: ReductionLayer[];
  setShow: (layers: ReductionLayer[]) => void;
  onChangedLayer: (value: number) => void;
}
const createReductionHierarchy = (svg: SVGGElement, children: ReductionLayer[]): ReductionHierarchy => {
  const hierarchy: ReductionHierarchy = {
    svg,
    children,
    _show: [],
    setShow(layers) {
      this._show = layers;
      this._show.forEach(e => e.onAudioUpdate());
      svg.replaceChildren(...this._show.map(e => e.svg));
    },
    onChangedLayer(value) {
      const visible = children.filter(e => value >= e.layer);
      (this._show || []).forEach(e => e.renewStrong(value));
      visible.forEach(e => e.renewStrong(value));
      this.setShow(visible);
    },
  };
  return hierarchy;
};

function getReductionSVG(
  bracket: Bracket,
  dot: Dot,
  ir_symbol: IRMSymbol,
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = "time-span-node";
  svg.appendChild(bracket.svg);
  if (true) { svg.appendChild(dot.svg); }
  if (false) { svg.appendChild(ir_symbol.svg); }
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
    const parts = e.map(mel => {
      const model = createReductionModel(mel, l);
      const view_model = createReductionViewModel(model);
      const bracket = createBracket(getBracketSVG(), view_model);
      const dot = createDot(getDotSVG(), view_model);
      const ir_symbol = createIRMSymbol(getIRMSymbolSVG(model));
      const svg = getReductionSVG(bracket, dot, ir_symbol);
      const view = createReductionView(svg, bracket, dot, ir_symbol, view_model);
      return createReduction(model, view);
    });
    const svg = getSVGG(`layer-${l}`, parts);
    return createReductionLayer(svg, parts, l);
  });
  const svg = getSVGG("time-span-reduction", layer);
  const time_span_tree = createReductionHierarchy(svg, layer);

  controllers.window.addListeners(...time_span_tree.children.flatMap(e => e.children).map(e => e.onWindowResized));
  controllers.hierarchy.addListeners(time_span_tree.onChangedLayer);
  controllers.time_range.addListeners(...time_span_tree.children.flatMap(e => e.children).map(e => e.onTimeRangeChanged));
  controllers.melody_color.addListeners(...time_span_tree.children.flatMap(e => e.children).map(e => e.setColor));
  controllers.audio.addListeners(...time_span_tree.children.map(e => e.onAudioUpdate));
  time_span_tree.children.map(e => e.onAudioUpdate());

  return time_span_tree.svg
}
