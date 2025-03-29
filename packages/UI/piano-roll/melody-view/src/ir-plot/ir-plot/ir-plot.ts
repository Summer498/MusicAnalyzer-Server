import { MVVM_ViewModel_Impl } from "@music-analyzer/view/src/mvvm/mvvm-impl";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";

export class IRPlot
  extends MVVM_ViewModel_Impl<IRPlotModel, IRPlotView> {
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
