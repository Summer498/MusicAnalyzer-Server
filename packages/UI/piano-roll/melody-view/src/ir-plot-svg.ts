import { Hierarchy, Layer, Model, Part } from "./abstract/abstract-hierarchy";
import { ColorChangeable } from "./color-changeable";
import { Time } from "./facade";
import { HierarchyLevelController, MelodyColorController, SetColor } from "@music-analyzer/controllers";
import { Triad } from "@music-analyzer/irm";
import { NowAt } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { RequiredByMelodyElements } from "./required-by-melody-elements";

interface RequiredByIRPlotHierarchy {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly melody_color: MelodyColorController
  readonly hierarchy: HierarchyLevelController,
}

export class IRPlotAxis {
  readonly svg: SVGLineElement;
  constructor(
    readonly x1: number,
    readonly y1: number,
    readonly x2: number,
    readonly y2: number,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.setAttribute("x1", String(x1));
    this.svg.setAttribute("y1", String(y1));
    this.svg.setAttribute("x2", String(x2));
    this.svg.setAttribute("y2", String(y2));
    this.svg.style.stroke = "rgb(0, 0, 0)";
  }
}

export class IRPlotCircles {
  readonly svg: SVGGElement;
  private _show: IRPlotLayer[];
  get show() { return this._show; }
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._show = [];
  }
  setShow(visible_layers: IRPlotLayer[]) {
    this._show = visible_layers;
    this.svg.replaceChildren(...this._show.map(e => e.view.svg));
  }
}

export class IRPlotHierarchyModel {
  readonly width: number;
  readonly height: number;
  constructor(children: IRPlotLayer[]) {
    const w = Math.max(...children.map(e => e.view.model.w));
    const h = Math.max(...children.map(e => e.view.model.h));
    this.width = w;
    this.height = h;
  }
}

export class IRPlotHierarchyView {
  readonly svg: SVGGElement;
  readonly x_axis: IRPlotAxis;
  readonly y_axis: IRPlotAxis;
  readonly circles: IRPlotCircles;
  constructor(
    w: number,
    h: number,
  ) {
    this.x_axis = new IRPlotAxis(0, h / 2, w, h / 2);//(width, height);
    this.y_axis = new IRPlotAxis(w / 2, 0, w / 2, h);//(width, height);
    this.circles = new IRPlotCircles();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "implication-realization plot";
    this.svg.replaceChildren(this.x_axis.svg, this.y_axis.svg, this.circles.svg);
    this.svg.setAttribute("width", String(w));
    this.svg.setAttribute("height", String(h));
  }

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

export class MelodiesCache {
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

export class IRPlotModel
  extends Model {
  readonly melody: MelodiesCache
  get archetype() { return this.melody.getCurrentNote().melody_analysis.implication_realization as Triad; }
  constructor(
    melody_series: SerializedTimeAndAnalyzedMelody[],
  ) {
    super(
      new Time(0, 0),  // dummy
      new Time(0, 0),  // dummy
    );
    this.melody = new MelodiesCache(melody_series);
  }
  get is_visible() { return this.melody.is_visible; }
  getRangedMelody() { return this.melody.getRangedMelody() }
  getPositionRatio() { return this.melody.getPositionRatio() }
  getInterval() { return this.melody.getInterval() }
  getCurrentNote() { return this.melody.getCurrentNote() }
}

export class IRPlotViewModel {
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

export class IRPlotView
  extends ColorChangeable<"circle"> {
  readonly view_model: IRPlotViewModel
  constructor(
    protected readonly model: IRPlotModel,
  ) {
    super("circle");
    this.svg.style.stroke = "rgb(16, 16, 16)";
    this.svg.style.strokeWidth = String(6);
    this.view_model = new IRPlotViewModel()
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
}

export class IRPlot
  extends Part<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(
    model: IRPlotModel,
    view: IRPlotView,
  ) {
    super(model, view);
    this.view = view;
  }
  onAudioUpdate() {
    this.view.updatePosition();
  }
  onWindowResized() { }
  readonly setColor: SetColor = f => this.view.setColor(f(this.model.archetype))
}

export class IRPlotLayerModel {
  constructor(
    readonly w: number,
    readonly h: number,
  ) { }
}

export class IRPlotLayerView {
  readonly svg: SVGGElement;
  constructor(
    child: IRPlot,
    readonly layer: number,
    max: number,
    readonly model: IRPlotLayerModel
  ) {
    const base = Math.log(Math.min(child.view.view_model.w, child.view.view_model.h) / 10) / Math.log(max);
    child.view.updateRadius(Math.pow(base, max - layer / 2));
    // const base = Math.min(child.view.w, child.view.h) / 10 / max;
    // child.view.updateRadius(base * (max - layer/2));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `layer-${layer}`;
    this.svg.appendChild(child.view.svg);

    this.updateWidth(this.model.w);
    this.updateHeight(this.model.h);
  }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}

export class IRPlotLayer
  extends Layer<IRPlot> {
  readonly view: IRPlotLayerView
  constructor(
    children: IRPlot[],
    layer: number,
    max: number,
  ) {
    super(layer, children);
    this.view = new IRPlotLayerView(this.children[0], layer, max, new IRPlotLayerModel(this.children[0].view.view_model.w, this.children[0].view.view_model.h))
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}

export class IRPlotHierarchy
  extends Hierarchy<IRPlotLayer> {
  readonly view: IRPlotHierarchyView
  readonly model: IRPlotHierarchyModel
  #visible_layer: number;
  get show() { return this.view.circles.show }
  constructor(
    children: IRPlotLayer[],
    controllers: RequiredByIRPlotHierarchy,
  ) {
    super("IR-plot-hierarchy", children)
    this.#visible_layer = children.length;
    this.model = new IRPlotHierarchyModel(this.children);
    this.view = new IRPlotHierarchyView(this.model.width, this.model.height)
    controllers.hierarchy.addListeners(this.onChangedLayer.bind(this));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.melody_color.addListeners(this.setColor.bind(this));
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
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}

export class IRPlotSVG {
  readonly svg: SVGSVGElement;
  constructor(
    readonly children: IRPlotHierarchy[],
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.id = "IR-plot";
    children.forEach(e => this.svg.appendChild(e.view.svg));
    children.forEach(e => this.svg.setAttribute("width", String(e.model.width)));
    children.forEach(e => this.svg.setAttribute("height", String(e.model.height)));
  }
  onAudioUpdate() { }
  onWindowResized() { }
}

export function buildIRPlot(
    h_melodies: SerializedTimeAndAnalyzedMelody[][],
    controllers: RequiredByMelodyElements,
  ) {
  const N = h_melodies.length;

  const layers = h_melodies.map((e, l) => {
    const model = new IRPlotModel(e);
    const view = new IRPlotView(model);
    const part = new IRPlot(model, view);
    return new IRPlotLayer([part], l, N)
  })
  const hierarchy = [new IRPlotHierarchy(layers, controllers)]
  return new IRPlotSVG(hierarchy);
}
