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

interface IRPlotHierarchyModel { readonly width: number; readonly height: number; }
const createIRPlotHierarchyModel = (children: IRPlotLayer[]): IRPlotHierarchyModel => {
  const w = Math.max(...children.map(e => e.view.model.w));
  const h = Math.max(...children.map(e => e.view.model.h));
  return { width: w, height: h };
};

interface IRPlotHierarchyView {
  readonly svg: SVGGElement;
  readonly x_axis: IRPlotAxis;
  readonly y_axis: IRPlotAxis;
  readonly circles: IRPlotCircles;
  updateCircleVisibility: (visible_layer: IRPlotLayer[]) => void;
}
const createIRPlotHierarchyView = (
  svg: SVGGElement,
  x_axis: IRPlotAxis,
  y_axis: IRPlotAxis,
  circles: IRPlotCircles,
): IRPlotHierarchyView => ({
  svg,
  x_axis,
  y_axis,
  circles,
  updateCircleVisibility: (visible_layer) => circles.setShow(visible_layer),
});

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

interface IRPlotModel {
  readonly time: Time;
  readonly head: Time;
  readonly melody: MelodiesCache;
  readonly archetype: ITriad;
  readonly is_visible: boolean;
  getRangedMelody: () => SerializedTimeAndAnalyzedMelody[];
  getPositionRatio: () => number;
  getInterval: () => number[];
  getCurrentNote: () => SerializedTimeAndAnalyzedMelody;
}
const createIRPlotModel = (melody_series: SerializedTimeAndAnalyzedMelody[]): IRPlotModel => {
  const melody = new MelodiesCache(melody_series);
  const model: IRPlotModel = {
    time: createTime(0, 0),
    head: createTime(0, 0),
    melody,
    get archetype() { return melody.getCurrentNote().melody_analysis.implication_realization as ITriad; },
    get is_visible() { return melody.is_visible; },
    getRangedMelody: () => melody.getRangedMelody(),
    getPositionRatio: () => melody.getPositionRatio(),
    getInterval: () => melody.getInterval(),
    getCurrentNote: () => melody.getCurrentNote(),
  };
  return model;
};

interface IRPlotViewModel {
  readonly x0: number;
  readonly y0: number;
  readonly w: number;
  readonly h: number;
  getTranslatedX: (x: number) => number;
  getTranslatedY: (y: number) => number;
}
const createIRPlotViewModel = (): IRPlotViewModel => ({
  w: 500,
  h: 500,
  x0: 250,
  y0: 250,
  getTranslatedX: function (x: number) { return x * this.w / 2 + this.x0; },
  getTranslatedY: function (y: number) { return y * this.h / 2 + this.y0; },
});

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

interface IRPlotView {
  readonly svg: SVGGElement;
  readonly view_model: IRPlotViewModel;
  readonly model: IRPlotModel;
  updateRadius: (r: number) => void;
  updatePosition: () => void;
  setColor: (color: string) => void;
}
const createIRPlotView = (
  svg: SVGGElement,
  view_model: IRPlotViewModel,
  model: IRPlotModel,
): IRPlotView => {
  const updateX = (x: number) => {
    [x]
      .map(e => view_model.getTranslatedX(e))
      .map(e => nan2zero(e))
      .map(e => svg.setAttribute("cx", String(e)));
  };
  const updateY = (y: number) => {
    [y]
      .map(e => view_model.getTranslatedY(e))
      .map(e => nan2zero(e))
      .map(e => svg.setAttribute("cy", String(e)));
  };
  const easeInOutCos = (t: number) => (1 - Math.cos(t * Math.PI)) / 2;
  return {
    svg,
    view_model,
    model,
    updateRadius: (r) => { svg.style.r = String(r); },
    updatePosition: () => {
      const interval = model.getInterval();
      const curr = get_pos(interval[0], interval[1]);
      const next = get_pos(interval[1], interval[2]);
      const r = easeInOutCos(model.getPositionRatio());
      updateX(-((1 - r) * curr[0] + r * next[0]));
      updateY(-((1 - r) * curr[1] + r * next[1]));
    },
    setColor: (color: string) => { svg.style.fill = color; },
  };
};

interface IRPlot {
  readonly model: IRPlotModel;
  readonly view: IRPlotView;
  readonly svg: SVGGElement;
  onAudioUpdate: () => void;
  onWindowResized: () => void;
  setColor: SetColor;
}
const createIRPlot = (model: IRPlotModel, view: IRPlotView): IRPlot => ({
  model,
  view,
  get svg() { return view.svg; },
  onAudioUpdate: () => view.updatePosition(),
  onWindowResized: () => { },
  setColor: (f) => view.setColor(f(model.archetype)),
});

interface IRPlotLayerModel { readonly w: number; readonly h: number }
const createIRPlotLayerModel = (w: number, h: number): IRPlotLayerModel => ({ w, h });

interface IRPlotLayerView {
  readonly svg: SVGGElement;
  readonly layer: number;
  readonly model: IRPlotLayerModel;
  updateWidth: (w: number) => void;
  updateHeight: (h: number) => void;
}
const createIRPlotLayerView = (svg: SVGGElement, layer: number, model: IRPlotLayerModel): IRPlotLayerView => ({
  svg,
  layer,
  model,
  updateWidth: (w) => svg.setAttribute("width", String(w)),
  updateHeight: (h) => svg.setAttribute("height", String(h)),
});

interface IRPlotLayer {
  readonly svg: SVGGElement;
  readonly view: IRPlotLayerView;
  readonly children: IRPlot[];
  readonly layer: number;
  readonly children_model: { readonly time: Time }[];
  readonly show: IRPlot[];
  onAudioUpdate: () => void;
}
const createIRPlotLayer = (
  svg: SVGGElement,
  view: IRPlotLayerView,
  children: IRPlot[],
  layer: number,
): IRPlotLayer => {
  const children_model = children.map(e => e.model);
  const show = children;
  return {
    svg,
    view,
    children,
    layer,
    children_model,
    get show() { return show; },
    onAudioUpdate: () => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`),
  };
};

interface IRPlotHierarchy {
  readonly svg: SVGGElement;
  readonly children: IRPlotLayer[];
  readonly view: IRPlotHierarchyView;
  readonly model: IRPlotHierarchyModel;
  onChangedLayer: (value: number) => void;
  setShow: (layers: IRPlotLayer[]) => void;
  _show: IRPlotLayer[];
}
const createIRPlotHierarchy = (
  svg: SVGGElement,
  children: IRPlotLayer[],
  view: IRPlotHierarchyView,
  model: IRPlotHierarchyModel,
): IRPlotHierarchy => {
  let visible_layer = children.length;
  const hierarchy: IRPlotHierarchy = {
    svg,
    children,
    view,
    model,
    _show: [],
    onChangedLayer(value: number) {
      visible_layer = value;
      const show = children
        .filter(e => e.children[0].model.is_visible)
        .filter(e => 1 < e.layer && e.layer <= visible_layer);
      view.updateCircleVisibility(show);
    },
    setShow(layers: IRPlotLayer[]) {
      this._show = layers;
      this._show.forEach(e => e.onAudioUpdate());
      svg.replaceChildren(...this._show.map(e => e.svg));
    },
  };
  return hierarchy;
};

interface IRPlotSVG {
  readonly svg: SVGSVGElement;
  readonly children: IRPlotHierarchy[];
}
const createIRPlotSVG = (svg: SVGSVGElement, children: IRPlotHierarchy[]): IRPlotSVG => ({ svg, children });

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
    const model = createIRPlotModel(e);
    const circle_svg = getCircle();
    const view_model = createIRPlotViewModel();
    const view = createIRPlotView(circle_svg, view_model, model);
    const part = createIRPlot(model, view);
    const svg = getLayer(l, part);
    const layer_model = createIRPlotLayerModel(part.view.view_model.w, part.view.view_model.h);
    updateRadius(l, h_melodies.length, part);

    const layer_view = createIRPlotLayerView(svg, l, layer_model);
    layer_view.updateWidth(layer_model.w);
    layer_view.updateHeight(layer_model.h);

    const svgg = getSVGG(`layer-${l}`, [part]);
    return createIRPlotLayer(svgg, layer_view, [part], l);
  })

  const h_model = createIRPlotHierarchyModel(layers);
  const w = h_model.width
  const h = h_model.height

  const x_axis_svg = getAxis({ x1: 0, x2: w, y1: h / 2, y2: h / 2 });
  const y_axis_svg = getAxis({ x1: w / 2, x2: w / 2, y1: 0, y2: h });

  const x_axis = createIRPlotAxis(x_axis_svg);
  const y_axis = createIRPlotAxis(y_axis_svg);

  const circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const circles = createIRPlotCircles(circle_svg);
  const axis_svg = getAxisSVG(w, h, x_axis, y_axis, circles);
  const view = createIRPlotHierarchyView(axis_svg, x_axis, y_axis, circles);

  const svgg = getSVGG("IR-plot-hierarchy", layers);
  const hierarchy = [createIRPlotHierarchy(svgg, layers, view, h_model)]

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "IR-plot";
  hierarchy.forEach(e => svg.appendChild(e.view.svg));
  hierarchy.forEach(e => svg.setAttribute("width", String(e.model.width)));
  hierarchy.forEach(e => svg.setAttribute("height", String(e.model.height)));

  const ir_plot_svg = createIRPlotSVG(svg, hierarchy);

  controllers.window.addListeners(...ir_plot_svg.children.flatMap(e => e).flatMap(e => e.children).flatMap(e => e.children).map(e => e.onWindowResized.bind(e)));
  controllers.hierarchy.addListeners(...ir_plot_svg.children.flatMap(e => e.onChangedLayer.bind(e)));
  controllers.melody_color.addListeners(...ir_plot_svg.children.flatMap(e => e.children).flatMap(e => e.children).map(e => e.setColor.bind(e)));
  controllers.audio.addListeners(...ir_plot_svg.children.flatMap(e => e.children).map(e => e.onAudioUpdate.bind(e)));
  ir_plot_svg.children.flatMap(e => e.children).map(e => e.onAudioUpdate())

  return ir_plot_svg.svg;
}
