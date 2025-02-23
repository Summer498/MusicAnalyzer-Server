import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotLayer } from "./ir-plot-layer";

export class IRPlotHierarchy implements AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement;
  readonly circles: SVGGElement;
  readonly x_axis: SVGLineElement;
  readonly y_axis: SVGLineElement;
  #visible_layer: number;
  readonly children: IRPlotLayer[];
  private _show: IRPlotLayer[];
  get show() { return this._show; }
  constructor(hierarchical_melody: TimeAndAnalyzedMelody[][]) {
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
    this.x_axis.style.stroke = "rgb(0, 0, 0)";
    this.y_axis.style.stroke = "rgb(0, 0, 0)";
    this._show = [];
    this.#visible_layer = N;
  }
  setShow(visible_layers: IRPlotLayer[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.circles.replaceChildren(...this._show.map(e => e.svg));
  }
  updateLayer() {
    const visible_layer = this.children.filter(
      layer => {
        if (layer.child.model.is_visible === false) { return false; }
        return 1 < layer.layer && layer.layer <= this.#visible_layer;
      }
    );
    this.setShow(visible_layer);
  }
  onChangedLayer(value: number) {
    this.#visible_layer = value;
    this.updateLayer();
  }
  onAudioUpdate() {
    this.updateLayer();
    this.show.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() {}
}
