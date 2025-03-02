import { MVVM_ViewModel } from "@music-analyzer/view";
import { IRPlotModel } from "./ir-plot-model";
import { IRPlotView } from "./ir-plot-view";
import { Archetype } from "@music-analyzer/irm";

export class IRPlotVM extends MVVM_ViewModel<IRPlotModel, IRPlotView> {
  readonly view: IRPlotView;
  constructor(model: IRPlotModel) {
    const view = new IRPlotView(model);
    super(model, view);
    this.view = view;
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
