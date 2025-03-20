import { HierarchyLevelController, HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { AudioReflectableRegistry, CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyLayer, RequiredByMelodyLayer } from "./melody-layer";

export interface RequiredByMelodyHierarchy
  extends RequiredByMelodyLayer {
  hierarchy: HierarchyLevelController
  audio: AudioReflectableRegistry
}

export class MelodyHierarchy
  extends CollectionHierarchy<MelodyLayer>
  implements
  HierarchyLevelSubscriber {
  get show() { return this._show; }
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByMelodyHierarchy
  ) {
    super("melody", hierarchical_melodies.map((e, l) => new MelodyLayer(e, l, controllers)));
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
  }
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate())
    this.show.forEach(e => e.beep())
  }
}
