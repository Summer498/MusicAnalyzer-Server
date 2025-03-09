import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotLayer } from "../ir-plot-layer";
import { IRPlotCircles } from "./ir-plot-circles";
import { IRPlotAxis } from "./ir-plot-axis";
import { IRPlotModel } from "../ir-plot-model";

export class IRPlotHierarchy implements AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement;
  readonly x_axis: IRPlotAxis;
  readonly y_axis: IRPlotAxis;
  readonly circles: IRPlotCircles;
  readonly width: number;
  readonly height: number;
  #visible_layer: number;
  readonly children: IRPlotLayer[];
  get show() { return this.circles.show }
  constructor(hierarchical_melody: TimeAndAnalyzedMelody[][]) {
    const N = hierarchical_melody.length;
    this.children = hierarchical_melody.map((e, l) => new IRPlotLayer(e, l, N));
    const w = Math.max(...this.children.map(e => e.w));
    const h = Math.max(...this.children.map(e => e.h));
    this.width = w;
    this.height = h;

    this.x_axis = new IRPlotAxis(0, h / 2, w, h / 2);//(width, height);
    this.y_axis = new IRPlotAxis(w / 2, 0, w / 2, h);//(width, height);
    this.circles = new IRPlotCircles();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "implication-realization plot";
    this.svg.replaceChildren(this.x_axis.svg, this.y_axis.svg, this.circles.svg);
    this.svg.setAttribute("width", String(w));
    this.svg.setAttribute("height", String(h));
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
  setColor(getColor: (e: IRPlotModel) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
