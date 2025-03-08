import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotLayer } from "./ir-plot-layer";
import { Archetype } from "@music-analyzer/irm";

class IRPlotCircles {
  readonly svg: SVGGElement;
  private _show: IRPlotLayer[];
  get show() { return this._show; }
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._show = [];
  }
  setShow(visible_layers: IRPlotLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
}

class IRPlotXAxis {
  readonly svg: SVGLineElement;
  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.setAttribute("x1", String(0));
    this.svg.setAttribute("x2", String(this.width));
    this.svg.setAttribute("y1", String(this.height / 2));
    this.svg.setAttribute("y2", String(this.height / 2));
    this.svg.style.stroke = "rgb(0, 0, 0)";
  }
}

class IRPlotYAxis {
  readonly svg: SVGLineElement;
  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.svg.setAttribute("x1", String(this.width / 2));
    this.svg.setAttribute("x2", String(this.width / 2));
    this.svg.setAttribute("y1", String(0));
    this.svg.setAttribute("y1", String(this.height));
    this.svg.style.stroke = "rgb(0, 0, 0)";
  }
}

class IRPlotAxis {
}

export class IRPlotHierarchy implements AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement;
  readonly x_axis: IRPlotXAxis;
  readonly y_axis: IRPlotYAxis;
  readonly circles: IRPlotCircles;
  #visible_layer: number;
  readonly children: IRPlotLayer[];
  readonly width: number;
  readonly height: number;
  get show() { return this.circles.show }
  constructor(hierarchical_melody: TimeAndAnalyzedMelody[][]) {
    const N = hierarchical_melody.length;
    this.children = hierarchical_melody.map((e, l) => new IRPlotLayer(e, l, N));
    this.width = Math.max(...this.children.map(e => e.w));
    this.height = Math.max(...this.children.map(e => e.h));
    this.x_axis = new IRPlotXAxis(this.width, this.height);
    this.y_axis = new IRPlotYAxis(this.width, this.height);
    this.circles = new IRPlotCircles();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "implication-realization plot";
    this.svg.replaceChildren(this.x_axis.svg, this.y_axis.svg, this.circles.svg);
    this.svg.setAttribute("width", String(this.width));
    this.svg.setAttribute("height", String(this.height));
    this.#visible_layer = N;
  }
  updateLayer() {
    const visible_layer = this.children.filter(
      layer => {
        if (layer.child.model.is_visible === false) { return false; }
        return 1 < layer.layer && layer.layer <= this.#visible_layer;
      }
    );
    this.circles.setShow(visible_layer);
  }
  onChangedLayer(value: number) {
    this.#visible_layer = value;
    this.updateLayer();
  }
  onAudioUpdate() {
    this.updateLayer();
    this.children.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() { }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
