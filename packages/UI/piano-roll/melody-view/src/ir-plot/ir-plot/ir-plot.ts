import { AudioReflectableRegistry, MVVM_ViewModel } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyColorController } from "@music-analyzer/controllers";

export class IRPlot
  extends MVVM_ViewModel<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(
    e: TimeAndAnalyzedMelody[],
    controllers: [MelodyColorController, AudioReflectableRegistry],
  ) {
    const model = new IRPlotModel(e);
    const view = new IRPlotView(model, [controllers[0]]);
    super(model, view);
    this.view = view;
    controllers[1].register(this);
  }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
  onWindowResized() { }
}
