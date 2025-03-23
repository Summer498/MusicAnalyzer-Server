import { AudioReflectableRegistry, MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView, RequiredByIRPlotView } from "./ir-plot-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SetColor } from "@music-analyzer/controllers";

export interface RequiredByIRPlot
  extends RequiredByIRPlotView {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
}
export class IRPlot
  extends MVVM_ViewModel<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(
    e: TimeAndAnalyzedMelody[],
  ) {
    const model = new IRPlotModel(e);
    const view = new IRPlotView(model);
    super(model, view);
    this.view = view;
  }
  onAudioUpdate() {
    this.view.updatePosition();
  }
  onWindowResized() { }
  readonly setColor: SetColor = f => this.view.setColor(f)
}
