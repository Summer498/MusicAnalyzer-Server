import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRPlotLayerView } from "./ir-plot-layer-view";
import { IRPlot, RequiredByIRPlot } from "../ir-plot";
import { IRPlotLayerModel } from "./ir-plot-layer-model";

export interface RequiredByIRPlotLayer
  extends RequiredByIRPlot { }
export class IRPlotLayer {
  readonly view: IRPlotLayerView
  readonly child: IRPlot;
  constructor(
    melody_series: TimeAndAnalyzedMelody[],
    readonly layer: number,
    max: number,
    controllers: RequiredByIRPlotLayer,
  ) {
    this.child = new IRPlot(melody_series, controllers);
    this.view = new IRPlotLayerView(this.child, layer, max, new IRPlotLayerModel(this.child.view.w, this.child.view.h))
  }
}
