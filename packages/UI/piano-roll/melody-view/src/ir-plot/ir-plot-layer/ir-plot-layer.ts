import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRPlotLayerView } from "./ir-plot-layer-view";
import { IRPlot } from "../ir-plot";
import { hasArchetype } from "@music-analyzer/controllers";

export class IRPlotLayer {
  readonly view: IRPlotLayerView
  readonly child: IRPlot;
  readonly w: number;
  readonly h: number;
  constructor(
    melody_series: TimeAndAnalyzedMelody[],
    readonly layer: number,
    max: number
  ) {
    this.child = new IRPlot(melody_series);
    this.view = new IRPlotLayerView(this.child, layer, max);
    this.w = this.child.view.w;
    this.h = this.child.view.h;
    this.view.updateWidth(this.w);
    this.view.updateHeight(this.h);
  }
  onAudioUpdate() { this.child.onAudioUpdate(); }
  setColor(getColor: (e: hasArchetype) => string) { this.child.setColor(getColor); }
  updateColor() { this.child.updateColor(); }
}

