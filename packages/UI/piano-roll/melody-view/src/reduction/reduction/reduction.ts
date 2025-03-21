import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "../reduction-view";
import { RequiredByReductionView } from "../reduction-view/reduction-view";
import { MVVM_ViewModel } from "@music-analyzer/view";

export interface RequiredByReduction
  extends RequiredByReductionView { }
export class Reduction
  extends MVVM_ViewModel<ReductionModel, ReductionView> {
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
    controllers: RequiredByReduction
  ) {
    const model = new ReductionModel(melody, layer);
    super(model, new ReductionView(model, controllers));
  }
  renewStrong(strong: boolean) { this.view.strong = strong; }
}
