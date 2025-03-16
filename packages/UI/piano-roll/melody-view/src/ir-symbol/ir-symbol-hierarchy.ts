import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { IRSymbolModel } from "./ir-symbol-model";
import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";

export class IRSymbolHierarchy extends CollectionHierarchy<IRSymbolLayer> implements HierarchyLevelSubscriber{
  constructor(hierarchical_melodies: TimeAndAnalyzedMelody[][]) {
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l)));
  }
  setColor(getColor: (e: IRSymbolModel) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
