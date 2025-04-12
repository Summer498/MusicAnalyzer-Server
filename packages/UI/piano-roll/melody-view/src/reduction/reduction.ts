import { SetColor } from "@music-analyzer/controllers";
import { Part } from "../abstract/abstract-part";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "./reduction-view/reduction-view";

export class Reduction
  extends Part<ReductionModel, ReductionView> {
  constructor(
    model: ReductionModel,
    view: ReductionView,
  ) {
    super(model, view);
  }
  readonly setColor: SetColor = f => this.view.setColor(f)
  renewStrong(strong: boolean) { this.view.strong = strong; }
  onTimeRangeChanged() { this.view.onTimeRangeChanged() }
  onWindowResized() { this.view.onWindowResized() }
}
