import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { IRPlotLayerView } from "./ir-plot-layer-view";
import { IRPlot } from "../ir-plot/ir-plot";
import { RequiredByIRPlot } from "../ir-plot/ir-plot";
import { IRPlotLayerModel } from "./ir-plot-layer-model";
import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";

export interface RequiredByIRPlotLayer
  extends RequiredByIRPlot { }
export class IRPlotLayer
  implements
  AudioReflectable,
  WindowReflectable {
  readonly view: IRPlotLayerView
  readonly children: [IRPlot];
  constructor(
    melody_series: TimeAndAnalyzedMelody[],
    readonly layer: number,
    max: number,
  ) {
    this.children = [new IRPlot(melody_series)];
    this.view = new IRPlotLayerView(this.children[0], layer, max, new IRPlotLayerModel(this.children[0].view.view_model.w, this.children[0].view.view_model.h))
  }
  onAudioUpdate() { this.children.forEach(e=>e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e=>e.onWindowResized()) }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
}
