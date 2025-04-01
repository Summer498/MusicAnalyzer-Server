import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { SetColor } from "./facade";
import { IRPlotLayerView } from "./ir-plot-layer-view";
import { IRPlot } from "../ir-plot/ir-plot";
import { IRPlotLayerModel } from "./ir-plot-layer-model";
import { I_IRPlotLayer } from "../../interface/ir-plot/ir-plot-layer";

export class IRPlotLayer
  implements I_IRPlotLayer {
  readonly view: IRPlotLayerView
  readonly children: [IRPlot];
  constructor(
    melody_series: SerializedTimeAndAnalyzedMelody[],
    readonly layer: number,
    max: number,
  ) {
    this.children = [new IRPlot(melody_series)];
    this.view = new IRPlotLayerView(this.children[0], layer, max, new IRPlotLayerModel(this.children[0].view.view_model.w, this.children[0].view.view_model.h))
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}
