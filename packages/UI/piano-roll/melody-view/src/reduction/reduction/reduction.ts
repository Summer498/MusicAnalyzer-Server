import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ReductionModel } from "./reduction-model";
import { ReductionViewModel, ReductionView } from "../reduction-view";

export class Reduction
  extends MVVM_ViewModel<ReductionModel, ReductionView> {
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
  ) {
    const model = new ReductionModel(melody, layer);
    super(model, new ReductionView(model));
  }
  renewStrong(strong: boolean) {
    this.view.strong = strong;
  }
  setColor(getColor: (e: ReductionViewModel) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
  onWindowResized() {
    this.view.onWindowResized()
  }
}
