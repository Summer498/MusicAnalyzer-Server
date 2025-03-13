import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbolVM } from "./ir-symbol-view-model";
import { IRSymbolModel } from "./ir-symbol-model";

export class IRSymbolLayer extends CollectionLayer<IRSymbolVM> {
  constructor(melodies: TimeAndAnalyzedMelody[], layer: number) {
    super(layer, melodies.map(e => new IRSymbolVM(e, layer)));
  }
  setColor(getColor: (e: IRSymbolModel) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
