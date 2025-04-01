import { MVVM_ViewModel_Impl } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { SetColor } from "./facade";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";

export class IRPlot
  extends MVVM_ViewModel_Impl<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(
    e: SerializedTimeAndAnalyzedMelody[],
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
