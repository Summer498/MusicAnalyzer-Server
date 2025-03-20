import { HierarchyLevelController, HierarchyLevelSubscriber, MelodyColorController } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, CollectionHierarchy, WindowReflectableRegistry } from "@music-analyzer/view";
import { ReductionLayer } from "./reduction-layer";

export class ReductionHierarchy
  extends CollectionHierarchy<ReductionLayer>
  implements
  HierarchyLevelSubscriber {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: [HierarchyLevelController, MelodyColorController, AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super("time-span-reduction", hierarchical_melodies.map((e, l) => new ReductionLayer(e, l, [controllers[1]])));
    controllers[0].register(this);
    controllers[2].register(this);
    controllers[3].register(this);
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value >= e.layer);
    this.show.forEach(e => e.renewStrong(value));
    visible_layer.forEach(e => e.renewStrong(value));
    this.setShow(visible_layer);
  }
}
