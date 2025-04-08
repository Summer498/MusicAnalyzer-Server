import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SetColor } from "@music-analyzer/controllers";
import { CollectionLayer } from "@music-analyzer/view";
import { IRPlotLayerView } from "./ir-plot-layer-view";
import { IRPlotLayerModel } from "./ir-plot-layer-model";
import { I_IRPlotLayer } from "./i-ir-plot-layer";
import { IRPlot } from "./ir-plot";

export class IRPlotLayer
  extends CollectionLayer<IRPlot>
  implements I_IRPlotLayer {
  readonly view: IRPlotLayerView
  constructor(
    melody_series: SerializedTimeAndAnalyzedMelody[],
    layer: number,
    max: number,
  ) {
    super(layer, [new IRPlot(melody_series)]);
    this.view = new IRPlotLayerView(this.children[0], layer, max, new IRPlotLayerModel(this.children[0].view.view_model.w, this.children[0].view.view_model.h))
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}
