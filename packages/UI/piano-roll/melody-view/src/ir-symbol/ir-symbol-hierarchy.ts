import { HierarchyLevelController, HierarchyLevelSubscriber, TimeRangeSubscriber } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable, CollectionHierarchy, WindowReflectable } from "@music-analyzer/view";
import { IRSymbolLayer, RequiredByIRSymbolLayer } from "./ir-symbol-layer";

export interface RequiredByIRSymbolHierarchy
  extends RequiredByIRSymbolLayer {
  readonly hierarchy: HierarchyLevelController
}

export class IRSymbolHierarchy
  extends CollectionHierarchy<IRSymbolLayer>
  implements
  HierarchyLevelSubscriber,
  TimeRangeSubscriber,
  AudioReflectable,
  WindowReflectable {
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByIRSymbolHierarchy
  ) {
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l, controllers)));
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
