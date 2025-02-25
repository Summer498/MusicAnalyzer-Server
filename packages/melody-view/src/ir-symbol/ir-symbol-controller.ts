import { MVCController } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { Archetype } from "@music-analyzer/irm";

export class IRSymbolController extends MVCController {
  readonly view: IRSymbolView;
  constructor(
    readonly model: IRSymbolModel,
  ) {
    super();

    this.view = new IRSymbolView(this.model);
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
}
