import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "./reduction-view/reduction-view";
import { MVVM_ViewModel_Impl } from "@music-analyzer/view/src/mvvm/mvvm-impl";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";
import { IReduction } from "../interface/reduction/reduction";

export class Reduction
  extends MVVM_ViewModel_Impl<ReductionModel, ReductionView>
  implements IReduction {
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
  ) {
    const model = new ReductionModel(melody, layer);
    super(model, new ReductionView(model));
  }
  readonly setColor: SetColor = f => this.view.setColor(f)
  renewStrong(strong: boolean) { this.view.strong = strong; }
  onTimeRangeChanged() { this.view.onTimeRangeChanged() }
  onWindowResized() { this.view.onWindowResized() }
}
