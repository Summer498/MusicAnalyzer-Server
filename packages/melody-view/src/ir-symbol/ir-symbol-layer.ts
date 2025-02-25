import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { IRSymbolController } from "./ir-symbol-controller";
import { IRSymbolModel } from "./ir-symbol-model";
import { Archetype } from "@music-analyzer/irm";

export class IRSymbolLayer extends CollectionLayer {
  readonly children: IRSymbolController[];
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number
  ) {
    const children = melodies.map(e => new IRSymbolController(new IRSymbolModel(e, layer)));
    super(children, layer);
    this.children = children;
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e=>e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
