import { MVVM_ViewModel } from "@music-analyzer/view";
import { Archetype } from "@music-analyzer/irm";
import { ReductionModel } from "./reduction-model";
import { ReductionView } from "./reduction-view";

export class ReductionVM extends MVVM_ViewModel<ReductionModel, ReductionView> {
  constructor(
    model: ReductionModel,
    implication_realization: Archetype
  ) {
    super(model, new ReductionView(model, implication_realization));
  }
  renewStrong(strong: boolean) {
    this.view.strong = strong;
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
}
