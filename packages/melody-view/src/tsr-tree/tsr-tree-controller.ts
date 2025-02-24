import { MVCController } from "@music-analyzer/view";
import { Archetype } from "@music-analyzer/irm";
import { ReductionModel } from "./tsr-tree-model";
import { ReductionView } from "./tsr-tree-view";

export class ReductionController extends MVCController {
  readonly view: ReductionView;
  constructor(
    readonly model: ReductionModel,
    implication_realization: Archetype
  ) {
    super();
    this.view = new ReductionView(this.model, implication_realization);
  }
  renewStrong(strong: boolean) {
    this.view.strong = strong;
  }
}
