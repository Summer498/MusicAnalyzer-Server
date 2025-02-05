import { Controller } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";

export class IRSymbolController implements Controller {
  model: IRSymbolModel;
  view: IRSymbolView;
  constructor(model: IRSymbolModel) {
    this.model = model;
    this.view = new IRSymbolView(this.model);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  };
}

