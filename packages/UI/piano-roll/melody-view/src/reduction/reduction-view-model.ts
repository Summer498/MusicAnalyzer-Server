import { MVVM_ViewModel } from "@music-analyzer/view";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "./reduction-view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReductionViewModel } from "./reduction-view/reduction-view-model";

export class ReductionVM extends MVVM_ViewModel<ReductionModel, ReductionView> {
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
