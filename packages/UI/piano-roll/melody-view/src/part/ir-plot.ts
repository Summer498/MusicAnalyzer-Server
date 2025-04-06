import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SetColor } from "@music-analyzer/controllers";
import { IRPlotModel } from "../model";
import { IRPlotView } from "../view";
import { Part } from "./abstract-part";

export class IRPlot
  extends Part<IRPlotModel, IRPlotView> {
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
