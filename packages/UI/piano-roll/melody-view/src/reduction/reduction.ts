import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "./reduction-view/reduction-view";
import { MVVM_ViewModel } from "@music-analyzer/view/src/mvvm/mvvm";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";

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
