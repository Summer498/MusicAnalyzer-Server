import { MVCController } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";

export class IRSymbolController extends MVCController {
  readonly model: IRSymbolModel;
  readonly view: IRSymbolView;
  constructor(model: IRSymbolModel) {
    super();
    this.model = model;
    this.view = new IRSymbolView(this.model);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  };
}

