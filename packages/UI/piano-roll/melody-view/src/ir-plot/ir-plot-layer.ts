import { SetColor } from "@music-analyzer/controllers";
import { IRPlotLayerView } from "./ir-plot-layer-view";
import { IRPlotLayerModel } from "./ir-plot-layer-model";
import { I_IRPlotLayer } from "./i-ir-plot-layer";
import { IRPlot } from "./ir-plot";
import { Layer } from "../abstract/abstract-layer";

export class IRPlotLayer
  extends Layer<IRPlot>
  implements I_IRPlotLayer {
  readonly view: IRPlotLayerView
  constructor(
    children: IRPlot[],
    layer: number,
    max: number,
  ) {
    super(layer, children);
    this.view = new IRPlotLayerView(this.children[0], layer, max, new IRPlotLayerModel(this.children[0].view.view_model.w, this.children[0].view.view_model.h))
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}
