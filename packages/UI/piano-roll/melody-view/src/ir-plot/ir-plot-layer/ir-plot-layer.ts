import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRPlotLayerView } from "./ir-plot-layer-view";
import { IRPlot } from "../ir-plot";
import { MelodyColorController } from "@music-analyzer/controllers";
import { AudioReflectableRegistry } from "@music-analyzer/view";

export class IRPlotLayer {
  readonly view: IRPlotLayerView
  readonly child: IRPlot;
  readonly w: number;
  readonly h: number;
  constructor(
    melody_series: TimeAndAnalyzedMelody[],
    readonly layer: number,
    max: number,
    controllers: [MelodyColorController, AudioReflectableRegistry],
  ) {
    this.child = new IRPlot(melody_series, controllers);
    this.view = new IRPlotLayerView(this.child, layer, max);
    this.w = this.child.view.w;
    this.h = this.child.view.h;
    this.view.updateWidth(this.w);
    this.view.updateHeight(this.h);
  }
}
