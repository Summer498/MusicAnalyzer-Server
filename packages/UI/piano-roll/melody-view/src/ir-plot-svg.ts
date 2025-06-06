import { ITriad } from "@music-analyzer/irm";
import { NowAt } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { HierarchyLevelController, MelodyColorController, SetColor } from "@music-analyzer/controllers";
import { Time, createTime } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";

interface IRPlotAxis { readonly svg: SVGLineElement }
const createIRPlotAxis = (svg: SVGLineElement): IRPlotAxis => ({ svg })

interface IRPlotCircles {
  readonly svg: SVGGElement;
  readonly show: IRPlotLayer[];
  setShow: (visible_layers: IRPlotLayer[]) => void;
}
const createIRPlotCircles = (svg: SVGGElement): IRPlotCircles => {
  let show: IRPlotLayer[] = [];
  const setShow = (visible_layers: IRPlotLayer[]) => {
    show = visible_layers;
    svg.replaceChildren(...show.map(e => e.view.svg));
  };
  return {
    svg,
    get show() { return show; },
    setShow,
  };
};

class IRPlotHierarchyModel {
  readonly width: number;
  readonly height: number;
  constructor(children: IRPlotLayer[]) {
    const w = Math.max(...children.map(e => e.view.model.w));
    const h = Math.max(...children.map(e => e.view.model.h));
    this.width = w;
    this.height = h;
  }
}

class IRPlotHierarchyView {
  constructor(
    readonly svg: SVGGElement,
    readonly x_axis: IRPlotAxis,
    readonly y_axis: IRPlotAxis,
    readonly circles: IRPlotCircles,
  ) { }
  updateCircleVisibility(visible_layer: IRPlotLayer[]) {
    this.circles.setShow(visible_layer);
  }
}

class CacheCore {
  #cache: SerializedTimeAndAnalyzedMelody[];
  #index: number;
  constructor(
    readonly melody_series: SerializedTimeAndAnalyzedMelody[],
  ) {
    this.#cache = [];
    this.#index = 0;
  }

  cacheHit() {
    return this.#cache[1]?.time.has(NowAt.get());
  }
  cacheUpdate() {
    if (this.cacheHit()) { return this.#cache; }
    else {
      this.#index = this.melody_series.findIndex((value) =>
        value.time.has(NowAt.get())
      );
    }
    const i = this.#index;
    const N = this.melody_series.length;
    const melodies = [
      this.melody_series[Math.max(0, i - 1)],
      this.melody_series[Math.max(0, i)],
      this.melody_series[Math.min(i + 1, N - 1)],
      this.melody_series[Math.min(i + 2, N - 1)],
    ];
    this.#cache = melodies;
  }
  get index() {
    this.cacheUpdate();
    return this.#index;
  }
  get melody() {
    this.cacheUpdate();
    return this.#cache;
  }
}

class MelodiesCache {
  #core: CacheCore;
  constructor(
    melody_series: SerializedTimeAndAnalyzedMelody[],
  ) {
    this.#core = new CacheCore(melody_series);
  }
  get is_visible() {
    const i = this.#core.index;
    return 1 <= i && i < this.#core.melody_series.length - 1;
  }
  getRangedMelody() { return this.#core.melody; }
  getPositionRatio() {
    const melodies = this.#core.melody;
    const t = [melodies[1].time.begin, melodies[2].time.begin];
    return (NowAt.get() - t[0]) / (t[1] - t[0]);
  }
  getInterval() {
    const melodies = this.#core.melody.map(e => e.note);
    return [
      melodies[1] - melodies[0] || 0,
      melodies[2] - melodies[1] || 0,
      melodies[3] - melodies[2] || 0,
    ];
  }
  getCurrentNote() {
    return this.#core.melody[1];
  }
}

class IRPlotModel {
  readonly time: Time;
  readonly head: Time;
  readonly melody: MelodiesCache
  get archetype() { return this.melody.getCurrentNote().melody_analysis.implication_realization as ITriad; }
  constructor(
    melody_series: SerializedTimeAndAnalyzedMelody[],
  ) {
    this.time = createTime(0, 0);  // dummy
    this.head = createTime(0, 0);  // dummy
    this.melody = new MelodiesCache(melody_series);
  }
  get is_visible() { return this.melody.is_visible; }
  getRangedMelody() { return this.melody.getRangedMelody() }
  getPositionRatio() { return this.melody.getPositionRatio() }
  getInterval() { return this.melody.getInterval() }
  getCurrentNote() { return this.melody.getCurrentNote() }
}

class IRPlotViewModel {
  readonly x0: number;
  readonly y0: number;
  readonly w: number;
  readonly h: number;
  constructor() {
    this.w = 500;
    this.h = 500;
    this.x0 = 250;
    this.y0 = 250;
  }
  getTranslatedX(x: number) { return x * this.w / 2 + this.x0; }
  getTranslatedY(y: number) { return y * this.h / 2 + this.y0; }
}

const get_pos = (_x: number, _y: number) => {
  const a = 1 / 3;
  const x = a * _x;
  const y = a * _y;
  const double_angle_x = x * x - y * y;
  const double_angle_y = 2 * x * y;
  const r2 = 1 + x * x + y * y;
  return [
    double_angle_x / r2,
    double_angle_y / r2
  ];
};

const nan2zero = (x: number) => isNaN(x) ? 0 : x

class IRPlotView {
  constructor(
    readonly svg: SVGGElement,
    readonly view_model: IRPlotViewModel,
    readonly model: IRPlotModel
  ) {
  }
  updateRadius(r: number) {
    this.svg.style.r = String(r);
  }
  private updateX(x: number) {
    [x]
      .map(e => this.view_model.getTranslatedX(e))
      .map(e => nan2zero(e))
      .map(e => this.svg.setAttribute("cx", String(e)))
  }
  private updateY(y: number) {
    [y]
      .map(e => this.view_model.getTranslatedY(e))
      .map(e => nan2zero(e))
      .map(e => this.svg.setAttribute("cy", String(e)))
  }
  private easeInOutCos(t: number): number {
    return (1 - Math.cos(t * Math.PI)) / 2;
  }
  updatePosition() {
    const interval = this.model.getInterval();
    const curr = get_pos(interval[0], interval[1]);
    const next = get_pos(interval[1], interval[2]);
    const r = this.easeInOutCos(this.model.getPositionRatio());
    this.updateX(-((1 - r) * curr[0] + r * next[0]));
    this.updateY(-((1 - r) * curr[1] + r * next[1]));
  }
  readonly setColor = (color: string) => this.svg.style.fill = color;
}

class IRPlot {
  get svg() { return this.view.svg; }
  constructor(
    readonly model: IRPlotModel,
    readonly view: IRPlotView,
  ) {
    this.view = view;
  }
  onAudioUpdate() {
    this.view.updatePosition();
  }
  onWindowResized() { }
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
}

class IRPlotLayerModel {
  constructor(
    readonly w: number,
    readonly h: number,
  ) { }
}

class IRPlotLayerView {
  constructor(
    readonly svg: SVGGElement,
    readonly layer: number,
    readonly model: IRPlotLayerModel,
  ) { }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}

class IRPlotLayer {
  readonly children_model: { readonly time: Time }[];
  #show: IRPlot[];
  get show() { return this.#show; };
  constructor(
    readonly svg: SVGGElement,
    readonly view: IRPlotLayerView,
    readonly children: IRPlot[],
    readonly layer: number,
  ) {
    this.svg = svg;
    this.children_model = this.children.map(e => e.model);
    this.#show = children;
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}

class IRPlotHierarchy {
  #visible_layer: number;
  protected _show: IRPlotLayer[] = [];
 private get show() { return this.view.circles.show }
  constructor(
    readonly svg: SVGGElement,
    readonly children: IRPlotLayer[],
    readonly view: IRPlotHierarchyView,
    readonly model: IRPlotHierarchyModel,
  ) {
    this.#visible_layer = children.length;
  }
  updateLayer() {
    const visible_layer = this.children
      .filter(e => e.children[0].model.is_visible)
      .filter(e => 1 < e.layer && e.layer <= this.#visible_layer);
    this.view.updateCircleVisibility(visible_layer)
  }
  onChangedLayer(value: number) {
    this.#visible_layer = value;
    this.updateLayer();
  }
  setShow(visible_layers: IRPlotLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
}

class IRPlotSVG {
  constructor(
    readonly svg: SVGSVGElement,
    readonly children: IRPlotHierarchy[],
  ) { }
}

function getCircle() {
  const circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle_svg.style.stroke = "rgb(16, 16, 16)";
  circle_svg.style.strokeWidth = String(6);
  return circle_svg;
}

function getLayer(
  layer: number,
  child: { view: { svg: SVGElement } }
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = `layer-${layer}`;
  svg.appendChild(child.view.svg);
  return svg;
}

function updateRadius(
  l: number,
  N: number,
  part: IRPlot,
) {
  // const base = Math.log(Math.min(part.view.view_model.w, part.view.view_model.h) / 10) / Math.log(N);
  // part.view.updateRadius(Math.pow(base, N - l / 2));
  const base = Math.min(part.view.view_model.w, part.view.view_model.h) / 10 / N;
  part.view.updateRadius(base * (N - l / 2));
}

function getAxis(p: {
  readonly x1: number,
  readonly x2: number,
  readonly y1: number,
  readonly y2: number,
}) {
  const x_axis_svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
  x_axis_svg.setAttribute("x1", String(p.x1));
  x_axis_svg.setAttribute("x2", String(p.x2));
  x_axis_svg.setAttribute("y1", String(p.y1));
  x_axis_svg.setAttribute("y2", String(p.y2));
  x_axis_svg.style.stroke = "rgb(0, 0, 0)";
  return x_axis_svg;
}

function getAxisSVG(
  w: number,
  h: number,
  x_axis: { svg: SVGElement },
  y_axis: { svg: SVGElement },
  circles: { svg: SVGElement },
) {
  const axis_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  axis_svg.id = "implication-realization plot";
  axis_svg.replaceChildren(x_axis.svg, y_axis.svg, circles.svg);
  axis_svg.setAttribute("width", String(w));
  axis_svg.setAttribute("height", String(h));
  return axis_svg;
}
function getSVGG(id: string, children: { svg: SVGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));
  return svg;
}


export function buildIRPlot(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
  }
) {
  const layers = h_melodies.map((e, l) => {
    const model = new IRPlotModel(e);
    const circle_svg = getCircle();
    const view_model = new IRPlotViewModel()
    const view = new IRPlotView(circle_svg, view_model, model);
    const part = new IRPlot(model, view);
    const svg = getLayer(l, part)
    const layer_model = new IRPlotLayerModel(part.view.view_model.w, part.view.view_model.h);
    updateRadius(l, h_melodies.length, part);

    const layer_view = new IRPlotLayerView(svg, l, layer_model)
    layer_view.updateWidth(layer_model.w);
    layer_view.updateHeight(layer_model.h);

    const svgg = getSVGG(`layer-${l}`, [part]);
    return new IRPlotLayer(svgg, layer_view, [part], l);
  })

  const h_model = new IRPlotHierarchyModel(layers);
  const w = h_model.width
  const h = h_model.height

  const x_axis_svg = getAxis({ x1: 0, x2: w, y1: h / 2, y2: h / 2 });
  const y_axis_svg = getAxis({ x1: w / 2, x2: w / 2, y1: 0, y2: h });

  const x_axis = createIRPlotAxis(x_axis_svg);
  const y_axis = createIRPlotAxis(y_axis_svg);

  const circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const circles = createIRPlotCircles(circle_svg);
  const axis_svg = getAxisSVG(w, h, x_axis, y_axis, circles);
  const view = new IRPlotHierarchyView(axis_svg, x_axis, y_axis, circles);

  const svgg = getSVGG("IR-plot-hierarchy", layers);
  const hierarchy = [new IRPlotHierarchy(svgg, layers, view, h_model)]

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "IR-plot";
  hierarchy.forEach(e => svg.appendChild(e.view.svg));
  hierarchy.forEach(e => svg.setAttribute("width", String(e.model.width)));
  hierarchy.forEach(e => svg.setAttribute("height", String(e.model.height)));

  const ir_plot_svg = new IRPlotSVG(svg, hierarchy);

  controllers.window.addListeners(...ir_plot_svg.children.flatMap(e => e).flatMap(e => e.children).flatMap(e => e.children).map(e => e.onWindowResized.bind(e)));
  controllers.hierarchy.addListeners(...ir_plot_svg.children.flatMap(e => e.onChangedLayer.bind(e)));
  controllers.melody_color.addListeners(...ir_plot_svg.children.flatMap(e => e.children).flatMap(e => e.children).map(e => e.setColor.bind(e)));
  controllers.audio.addListeners(...ir_plot_svg.children.flatMap(e => e.children).map(e => e.onAudioUpdate.bind(e)));
  ir_plot_svg.children.flatMap(e => e.children).map(e => e.onAudioUpdate())

  return ir_plot_svg.svg;
}
