import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbolVM } from "./ir-symbol-view-model";
import { IRSymbolModel } from "./ir-symbol-model";
import { Archetype } from "@music-analyzer/irm";

export class IRSymbolLayer extends CollectionLayer {
  readonly children: IRSymbolVM[];
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number
  ) {
    const children = melodies.map(e => new IRSymbolVM(new IRSymbolModel(e, layer)));
    super(children, layer);
    this.children = children;
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e=>e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
