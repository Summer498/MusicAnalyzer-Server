import { MVCController } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";

export class IRPlotController extends MVCController {
  readonly model: IRPlotModel;
  readonly view: IRPlotView;
  constructor(model: IRPlotModel) {
    super();
    this.model = model;
    this.view = new IRPlotView(this.model);
  }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
}
