import { TSRModel } from "./tsr-tree-model";
import { TSRView } from "./tsr-tree-view";
import { MVCController } from "@music-analyzer/view";
import { Archetype } from "@music-analyzer/irm";

export class TSRController extends MVCController {
  readonly model: TSRModel;
  readonly view: TSRView;
  constructor(
    model: TSRModel,
    implication_realization: Archetype
  ) {
    super();
    this.model = model;
    this.view = new TSRView(this.model, implication_realization);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  }
  renewStrong(strong: boolean) {
    this.view.strong = strong;
  }
}
