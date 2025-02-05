import { Controller } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { HierarchyLevel } from "@music-analyzer/controllers";

export class IRSymbolController implements Controller {
  model: IRSymbolModel;
  view: IRSymbolView;
  constructor(
    melody: IMelodyModel,
    hierarchy_level: HierarchyLevel,
    layer?: number
  ) {
    this.model = new IRSymbolModel(melody, hierarchy_level, layer);
    this.view = new IRSymbolView(this.model);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  };
}

