import { AudioReflectableRegistry, MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView, RequiredByIRPlotView } from "./ir-plot-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

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
    controllers: RequiredByIRPlot,
  ) {
    const model = new IRPlotModel(e);
    const view = new IRPlotView(model, controllers);
    super(model, view);
    this.view = view;
  }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
  onWindowResized() { }
}
