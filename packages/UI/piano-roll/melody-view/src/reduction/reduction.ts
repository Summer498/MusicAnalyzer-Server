import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SetColor } from "@music-analyzer/controllers";
import { Part } from "../abstract/abstract-part";
import { IReduction } from "./i-reduction";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "./reduction-view/reduction-view";

export class Reduction
  extends Part<ReductionModel, ReductionView>
  implements IReduction {
  constructor(
    melody: SerializedTimeAndAnalyzedMelody,
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
