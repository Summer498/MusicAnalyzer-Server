import { HierarchyLevelController } from "@music-analyzer/controllers";
import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectable } from "@music-analyzer/view";
import { CollectionHierarchy } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { RequiredByIRSymbolLayer } from "./ir-symbol-layer";
import { SetColor } from "@music-analyzer/controllers";

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
    super("implication-realization archetype", hierarchical_melodies.map((e, l) => new IRSymbolLayer(e, l)));
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
    controllers.melody_color.register(this)
  }
  readonly setColor: SetColor = f => this.children.forEach(e=>e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
