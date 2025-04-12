import { SetColor } from "@music-analyzer/controllers";
import { IRPlotHierarchyView } from "./ir-plot-hierarchy-view"
import { IRPlotHierarchyModel } from "./ir-plot-hierarchy-model";
import { IRPlotLayer } from "./ir-plot-layer";
import { RequiredByIRPlotHierarchy } from "./required-by-ir-plot-hierarchy";
import { Hierarchy } from "../abstract/abstract-hierarchy";

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
    controllers.hierarchy.addListeners(this.onChangedLayer);
    controllers.audio.addListeners(this.onAudioUpdate);
    controllers.window.addListeners(this.onWindowResized);
    controllers.melody_color.addListeners(this.setColor);
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
