import { TSRModel } from "./tsr-tree-model";
import { TSRView } from "./tsr-tree-view";
import { Controller } from "@music-analyzer/view";
import { Archetype } from "@music-analyzer/irm";

export class TSRController implements Controller {
  readonly model: TSRModel;
  readonly view: TSRView;
  constructor(
    model: TSRModel,
    implication_realization: Archetype
  ) {
    this.model = model;
    this.view = new TSRView(this.model, implication_realization);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  }
}

