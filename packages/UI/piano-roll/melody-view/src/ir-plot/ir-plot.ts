import { SetColor } from "@music-analyzer/controllers";
import { IRPlotModel } from "./ir-plot-model";
import { Part } from "../abstract/abstract-part";
import { IRPlotView } from "./ir-plot-view";

export class IRPlot
  extends Part<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(
    model: IRPlotModel,
    view: IRPlotView,
  ) {
    super(model, view);
    this.view = view;
  }
  onAudioUpdate() {
    this.view.updatePosition();
  }
  onWindowResized() { }
  readonly setColor: SetColor = f => this.view.setColor(f)
}
