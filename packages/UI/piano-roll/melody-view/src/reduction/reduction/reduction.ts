import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReductionModel } from "../reduction-model";
import { ReductionView, RequiredByReductionView } from "../reduction-view";
import { MVVM_ViewModel, WindowReflectable } from "@music-analyzer/view";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color-selector";

export interface RequiredByReduction
  extends RequiredByReductionView { }
export class Reduction
  extends MVVM_ViewModel<ReductionModel, ReductionView>
  implements
  TimeRangeSubscriber,
  WindowReflectable {
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
