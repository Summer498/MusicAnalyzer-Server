import { MVCController } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";

export class IRSymbolController extends MVCController {
  readonly view: IRSymbolView;
  constructor(
    readonly model: IRSymbolModel,
  ) {
    super();
    
    this.view = new IRSymbolView(this.model);
  }
}

