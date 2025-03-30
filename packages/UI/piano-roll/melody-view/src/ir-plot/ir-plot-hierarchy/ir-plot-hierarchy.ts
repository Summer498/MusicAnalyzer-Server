import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRPlotLayer } from "../ir-plot-layer/ir-plot-layer";
import { IRPlotHierarchyView } from "./ir-plot-hierarchy-view"
import { IRPlotHierarchyModel } from "./ir-plot-hierarchy-model";
import { SetColor } from "@music-analyzer/controllers";
import { RequiredByIRPlotHierarchy } from "../../requirement/ir-plot/required-ir-plot-hierarchy";

export class IRPlotHierarchy {
  readonly view: IRPlotHierarchyView
  readonly model: IRPlotHierarchyModel
  #visible_layer: number;
  readonly children: IRPlotLayer[];
  get show() { return this.view.circles.show }
  constructor(
    hierarchical_melody: TimeAndAnalyzedMelody[][],
    controllers: RequiredByIRPlotHierarchy,
  ) {
    const N = hierarchical_melody.length;
    this.#visible_layer = N;

    this.children = hierarchical_melody.map((e, l) => new IRPlotLayer(e, l, N));
    this.model = new IRPlotHierarchyModel(this.children);
    this.view = new IRPlotHierarchyView(this.model.width, this.model.height)
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.melody_color.register(this);
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
  onAudioUpdate() { this.children.forEach(e=>e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e=>e.onWindowResized()) }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}
