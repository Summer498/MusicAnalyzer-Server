import { HierarchyLevelController, HierarchyLevelSubscriber, MelodyBeepController, MelodyColorController } from "@music-analyzer/controllers";
import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyLayer } from "./melody-layer";

export class MelodyHierarchy
  extends CollectionHierarchy<MelodyLayer>
  implements
  HierarchyLevelSubscriber {
  get show() { return this._show; }
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [HierarchyLevelController, MelodyBeepController, MelodyColorController]
  ) {
    super("melody", hierarchical_melodies.map((e, l) => new MelodyLayer(e, l, [controllers[1], controllers[2]])));
    controllers[0].register(this);
  }
}
