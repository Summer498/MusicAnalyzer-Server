import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { TSRModel } from "./tsr-tree-model";
import { TSRView } from "./tsr-tree-view";
import { Controller } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";

export class TSRController implements Controller {
  readonly model: TSRModel;
  readonly view: TSRView;
  constructor(
    melody: IMelodyModel,
    hierarchy_level: HierarchyLevel,
    layer: number
  ) {
    this.model = new TSRModel(melody, hierarchy_level, layer);
    this.view = new TSRView(this.model, melody.melody_analysis.implication_realization);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  }
}

