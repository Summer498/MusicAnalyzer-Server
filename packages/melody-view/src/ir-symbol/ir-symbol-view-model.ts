import { MVVM_ViewModel } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { Archetype } from "@music-analyzer/irm";

export class IRSymbolVM extends MVVM_ViewModel<IRSymbolModel, IRSymbolView> {
  constructor(model: IRSymbolModel) {
    super(model, new IRSymbolView(model));
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
}
