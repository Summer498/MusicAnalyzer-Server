import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";
import { IRPlotLayer } from "../ir-plot-layer";
import { IRPlotModel } from "../ir-plot-model";
import { IRPlotHierarchyView } from "./ir-plot-hierarchy-view"

export class IRPlotHierarchy implements AudioReflectable, WindowReflectable {
  readonly view: IRPlotHierarchyView
  readonly width: number;
  readonly height: number;
  #visible_layer: number;
  readonly children: IRPlotLayer[];
  get show() { return this.view.circles.show }
  constructor(hierarchical_melody: TimeAndAnalyzedMelody[][]) {
    const N = hierarchical_melody.length;
    this.children = hierarchical_melody.map((e, l) => new IRPlotLayer(e, l, N));
    const w = Math.max(...this.children.map(e => e.w));
    const h = Math.max(...this.children.map(e => e.h));
    this.width = w;
    this.height = h;

    this.#visible_layer = N;
    this.view = new IRPlotHierarchyView(w, h)
  }
  updateLayer() {
    const visible_layer = this.children
      .filter(e => e.child.model.is_visible)
      .filter(e => 1 < e.layer && e.layer <= this.#visible_layer);
    this.view.updateCircleVisibility(visible_layer)
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
