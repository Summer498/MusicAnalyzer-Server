import { HierarchyLevelController, HierarchyLevelSubscriber, MelodyColorController } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionHierarchy } from "@music-analyzer/view";
import { IRSymbolLayer } from "./ir-symbol-layer";

export class IRSymbolHierarchy
  extends CollectionHierarchy<IRSymbolLayer>
  implements
  HierarchyLevelSubscriber {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [
      HierarchyLevelController,
      MelodyColorController,
    ]
  ) {
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l, [controllers[1]])));
    controllers[0].register(this);
  }
}
