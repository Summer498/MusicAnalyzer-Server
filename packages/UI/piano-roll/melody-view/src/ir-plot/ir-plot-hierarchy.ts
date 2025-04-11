import { CollectionHierarchy } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { IRPlotHierarchyView } from "./ir-plot-hierarchy-view"
import { IRPlotHierarchyModel } from "./ir-plot-hierarchy-model";
import { IRPlotLayer } from "./ir-plot-layer";
import { RequiredByIRPlotHierarchy } from "./required-by-ir-plot-hierarchy";

export class IRPlotHierarchy
  extends CollectionHierarchy<IRPlotLayer> {
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
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}
