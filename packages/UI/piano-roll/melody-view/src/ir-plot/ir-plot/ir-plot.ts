import { MVVM_ViewModel } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export class IRPlot
  extends MVVM_ViewModel<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(e: TimeAndAnalyzedMelody[]) {
    const model = new IRPlotModel(e);
    const view = new IRPlotView(model);
    super(model, view);
    this.view = view;
  }
  setColor(getColor: (e: IRPlotModel) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
  onWindowResized() {
  }
}
