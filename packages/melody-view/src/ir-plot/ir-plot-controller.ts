import { MVCController } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";
import { Archetype } from "@music-analyzer/irm";

export class IRPlotController extends MVCController {
  readonly view: IRPlotView;
  constructor(
    readonly model: IRPlotModel,
  ) {
    super();
    this.view = new IRPlotView(this.model);
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.view.setColor(getColor);
  }
  updateColor() {
    this.view.updateColor();
  }
  onAudioUpdate() {
    this.view.updatePosition();
    this.view.updateColor();
  }
}
