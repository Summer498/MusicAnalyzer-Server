import { MVVM_ViewModel } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { hasArchetype } from "@music-analyzer/controllers";

export class IRPlot
  extends MVVM_ViewModel<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(e: TimeAndAnalyzedMelody[]) {
    const model = new IRPlotModel(e);
    const view = new IRPlotView(model);
    super(model, view);
    this.view = view;
  }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
  setColor(getColor: (e: hasArchetype) => string) { this.view.setColor(getColor); }
  updateColor() { this.view.updateColor(); }
  onWindowResized() { }
}
