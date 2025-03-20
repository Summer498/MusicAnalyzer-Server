import { ColorChangeSubscriber, hasArchetype, HierarchyLevelController, HierarchyLevelSubscriber, MelodyColorController } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionHierarchy } from "@music-analyzer/view";
import { IRSymbolLayer } from "./ir-symbol-layer";

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
    controllers.forEach(e => e.register(this))
  }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
