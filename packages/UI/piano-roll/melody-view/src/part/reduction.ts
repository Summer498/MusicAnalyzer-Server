import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { SetColor } from "@music-analyzer/controllers";
import { ReductionModel } from "../model";
import { ReductionView } from "../view";
import { IReduction } from "../i-part";
import { Part } from "./abstract-part";

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
