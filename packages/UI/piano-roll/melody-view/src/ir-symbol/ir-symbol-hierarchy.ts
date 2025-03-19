import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { IRSymbolModel } from "./ir-symbol-model";
import { ColorChangeSubscriber, HierarchyLevelController, HierarchyLevelSubscriber, MelodyColorController } from "@music-analyzer/controllers";

export class IRSymbolHierarchy
  extends CollectionHierarchy<IRSymbolLayer>
  
implements
  HierarchyLevelSubscriber,
  ColorChangeSubscriber {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [
      HierarchyLevelController,
      MelodyColorController,
    ]
  ) {
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l)));
    controllers.forEach(e=>e.register(this))
  }
  setColor(getColor: (e: IRSymbolModel) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
