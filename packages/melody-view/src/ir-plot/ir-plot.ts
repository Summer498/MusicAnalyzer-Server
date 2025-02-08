import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { AccompanyToAudioRegistry, MVCController, MVCModel, MVCView } from "@music-analyzer/view";
import { NowAt } from "@music-analyzer/view-parameters";

export class IRPlotModel extends MVCModel {
  readonly melody_series: IMelodyModel[];
  #index: number;
  #cache: IMelodyModel[];
  constructor(melody_series: IMelodyModel[]) {
    super();
    this.melody_series = melody_series;
    this.#index = 0;
    this.#cache = [];
  }
  getCurrentIndex() {
    this.#index = this.melody_series.findIndex((value) =>
      value.begin <= NowAt.value && NowAt.value < value.end
    );
    return this.#index;
  }
  getRangedMelody() {
    if (this.#cache[1]?.begin <= NowAt.value && NowAt.value < this.#cache[1]?.end) {
      return this.#cache;
    }
    const i = this.getCurrentIndex();
    const N = this.melody_series.length;
    const melodies = [
      this.melody_series[Math.max(0, i - 1)],
      this.melody_series[Math.max(0, i)],
      this.melody_series[Math.min(i + 1, N - 1)],
      this.melody_series[Math.min(i + 2, N - 1)],
    ];
    this.#cache = melodies;
    return melodies;
  }
  getPositionRatio() {
    const melodies = this.getRangedMelody();
    const t = [melodies[1].begin, melodies[2].begin];
    return (NowAt.value - t[0]) / (t[1] - t[0]);
  }
  getInterval() {
    const melodies = this.getRangedMelody().map(e => e.note || NaN);  // TODO: e.note の型を number にする
    return [
      melodies[1] - melodies[0] || 0,
      melodies[2] - melodies[1] || 0,
      melodies[3] - melodies[2] || 0,
    ];
  }
  getCurrentNote() {
    return this.getRangedMelody()[1];
  }
}

export class IRPlotView extends MVCView {
  readonly model: IRPlotModel;
  readonly svg: SVGCircleElement;
  readonly x0: number;
  readonly y0: number;
  readonly w: number;
  readonly h: number;
  #x: number;
  #y: number;
  get x() { return this.#x; };
  get y() { return this.#y; };
  constructor(model: IRPlotModel) {
    super();
    this.model = model;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.#x = 0;
    this.#y = 0;
    this.w = 500;
    this.h = 500;
    this.x0 = 250;
    this.y0 = 250;
  }
  updateRadius(r: number) {
    this.svg.style.r = String(r);
  }
  private updateX(x: number) {
    this.#x = x;
    this.svg.style.cx = String(x * this.w / 2 + this.x0);
  }
  private updateY(y: number) {
    this.#y = y;
    this.svg.style.cy = String(y * this.h / 2 + this.y0);
  }
  private easeInOutCos(t: number): number {
    return (1 - Math.cos(t * Math.PI)) / 2;
  }
  updatePosition() {
    const interval = this.model.getInterval();
    const get_pos = (x: number, y: number) => {
      const a = 1 / 3;
      const r2 = Math.sqrt(
        1
        + a * x * a * x
        + a * y * a * y
      );
      return [
        a * x / r2,
        a * y / r2
      ];
    };
    const curr = get_pos(interval[0], interval[1]);
    const next = get_pos(interval[1], interval[2]);
    const r = this.easeInOutCos(this.model.getPositionRatio());

    this.updateX((1 - r) * curr[0] + r * next[0]);
    this.updateY(-((1 - r) * curr[1] + r * next[1]));
  }
  updateColor() {
    this.svg.style.stroke = "#111";
    this.svg.style.strokeWidth = String(6);
    this.svg.style.fill = get_color_of_Narmour_concept(this.model.getCurrentNote().melody_analysis.implication_realization);
  }
}

export class IRPlotController extends MVCController {
  readonly model: IRPlotModel;
  readonly view: IRPlotView;
  constructor(model: IRPlotModel) {
    super();
    this.model = model;
    this.view = new IRPlotView(this.model);
    AccompanyToAudioRegistry.instance.register(this);
  }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
}

export class IRPlotLayer {
  readonly svg: SVGGElement;
  readonly layer: number;
  readonly child: IRPlotController;
  readonly w: number;
  readonly h: number;
  constructor(
    melody_series: IMelodyModel[],
    layer: number,
    max: number
  ) {
    this.child = new IRPlotController(new IRPlotModel(melody_series));
    const base = Math.log(Math.min(this.child.view.w, this.child.view.h) / 10) / Math.log(max);
    this.child.view.updateRadius(Math.pow(base, max - layer/2));
    // const base = Math.min(this.child.view.w, this.child.view.h) / 10 / max;
    // this.child.view.updateRadius(base * (max - layer/2));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = `layer-${layer}`;
    this.svg.appendChild(this.child.view.svg);
    this.w = this.child.view.w;
    this.h = this.child.view.h;
    this.svg.style.width = String(this.w);
    this.svg.style.height = String(this.h);
    this.layer = layer;
  }
  onAudioUpdate() {
    this.child.onAudioUpdate();
  }
}

export class IRPlotGroup {
  readonly svg: SVGGElement;
  readonly circles: SVGGElement;
  readonly x_axis: SVGLineElement;
  readonly y_axis: SVGLineElement;
  private readonly children: IRPlotLayer[];
  private _show: IRPlotLayer[];
  constructor(hierarchical_melody: IMelodyModel[][]) {
    const N = hierarchical_melody.length;
    this.children = hierarchical_melody.map((e, l) => new IRPlotLayer(e, l, N));
    this.circles = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.x_axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.y_axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "implication-realization plot";
    this.svg.replaceChildren(this.x_axis, this.y_axis, this.circles);
    const w = Math.max(...this.children.map(e => e.w));
    const h = Math.max(...this.children.map(e => e.h));
    this.svg.style.width = String(w);
    this.svg.style.height = String(h);
    this.x_axis.setAttribute("x1", String(0));
    this.x_axis.setAttribute("x2", String(w));
    this.x_axis.setAttribute("y1", String(h / 2));
    this.x_axis.setAttribute("y2", String(h / 2));
    this.y_axis.setAttribute("x1", String(w / 2));
    this.y_axis.setAttribute("x2", String(w / 2));
    this.y_axis.setAttribute("y1", String(0));
    this.y_axis.setAttribute("y1", String(h));
    this.x_axis.style.stroke = "#000";
    this.y_axis.style.stroke = "#000";
    this._show = [];
    AccompanyToAudioRegistry.instance.onAudioUpdate();
  }
  setShow(visible_layers: IRPlotLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.circles.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(
      layer => 1 < layer.layer && layer.layer <= value
    );
    this.setShow(visible_layer);
  }
  onAudioUpdate() {
    this._show.forEach(e => e.onAudioUpdate());
  }
}
