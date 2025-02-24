import { MVCController } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";

export class IRPlotController extends MVCController {
  readonly view: IRPlotView;
  constructor(
    readonly model: IRPlotModel,
  ) {
    super();
    this.view = new IRPlotView(this.model);
  }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
}
