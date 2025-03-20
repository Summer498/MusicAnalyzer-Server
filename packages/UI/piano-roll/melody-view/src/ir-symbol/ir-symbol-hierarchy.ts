import { HierarchyLevelController, MelodyColorController } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionHierarchy, WindowReflectableRegistry } from "@music-analyzer/view";
import { IRSymbolLayer } from "./ir-symbol-layer";

export class IRSymbolHierarchy
  extends CollectionHierarchy<IRSymbolLayer> {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [HierarchyLevelController, MelodyColorController, AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l, [controllers[1], controllers[2], controllers[3]])));
    controllers[0].register(this);
  }
}
