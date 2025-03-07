import { MVVM_ViewModel } from "@music-analyzer/view";
import { IRSymbolModel } from "./ir-symbol-model";
import { IRSymbolView } from "./ir-symbol-view";
import { Archetype } from "@music-analyzer/irm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export class IRSymbolVM extends MVVM_ViewModel<IRSymbolModel, IRSymbolView> {
  constructor(
    melody: TimeAndAnalyzedMelody,
    layer: number,
  ) {
    const model = new IRSymbolModel(melody, layer);
    super(model, new IRSymbolView(model));
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.view.setColor(getColor);
  }
  updateColor() { this.view.updateColor(); }
}
