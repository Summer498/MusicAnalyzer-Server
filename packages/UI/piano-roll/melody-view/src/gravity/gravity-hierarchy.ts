import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { GravityLayer } from "./gravity-layer";
import { RequiredByGravityLayer } from "./gravity-layer";
import { GravitySwitcher } from "@music-analyzer/controllers";
import { GravitySwitcherSubscriber } from "@music-analyzer/controllers";
import { HierarchyLevelController } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { CollectionHierarchy } from "@music-analyzer/view/src/collection-hierarchy";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";

export interface RequiredByGravityHierarchy
  extends RequiredByGravityLayer {
  readonly switcher: GravitySwitcher,
  readonly hierarchy: HierarchyLevelController,
}

export class GravityHierarchy
  extends CollectionHierarchy<GravityLayer>
  implements
  GravitySwitcherSubscriber,
  TimeRangeSubscriber,
  AudioReflectable,
  WindowReflectable {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByGravityHierarchy,
  ) {
    super(mode, hierarchical_melodies.map((e, l) => new GravityLayer(mode, e, l)));
    controllers.switcher.register(this);
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
