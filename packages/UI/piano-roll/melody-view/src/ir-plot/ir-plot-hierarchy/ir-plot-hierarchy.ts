import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRPlotLayer, RequiredByIRPlotLayer } from "../ir-plot-layer";
import { IRPlotHierarchyView } from "./ir-plot-hierarchy-view"
import { HierarchyLevelController } from "@music-analyzer/controllers";
import { IRPlotHierarchyModel } from "./ir-plot-hierarchy-model";

export interface RequiredByIRPlotHierarchy
  extends RequiredByIRPlotLayer {
  readonly hierarchy: HierarchyLevelController,
}
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

    this.children = hierarchical_melody.map((e, l) => new IRPlotLayer(e, l, N, controllers));
    this.model = new IRPlotHierarchyModel(this.children);
    this.view = new IRPlotHierarchyView(this.model.width, this.model.height)
    controllers.hierarchy.register(this);
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
}
