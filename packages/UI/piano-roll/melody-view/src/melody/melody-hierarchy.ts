import { ColorChangeSubscriber } from "@music-analyzer/controllers";
import { HierarchyLevelController } from "@music-analyzer/controllers";
import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { CollectionHierarchy} from "@music-analyzer/view/src/collection-hierarchy";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { MelodyLayer } from "./melody-layer";
import { RequiredByMelodyLayer } from "./melody-layer";
import { SetColor } from "@music-analyzer/controllers";

export interface RequiredByMelodyHierarchy
  extends RequiredByMelodyLayer {
  readonly hierarchy: HierarchyLevelController
  readonly audio: AudioReflectableRegistry
}

export class MelodyHierarchy
  extends CollectionHierarchy<MelodyLayer>
  implements
  ColorChangeSubscriber,
  HierarchyLevelSubscriber,
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber,
  TimeRangeSubscriber,
  WindowReflectable {
  get show() { return this._show; }
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
    controllers: RequiredByMelodyHierarchy
  ) {
    super("melody", hierarchical_melodies.map((e, l) => new MelodyLayer(e, l)));
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.time_range.register(this);
    controllers.window.register(this)
    controllers.melody_beep.register(this);
    controllers.melody_color.register(this);
  }
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate())
    this.show.forEach(e => e.beep())
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  beep() { this.children.forEach(e => e.beep()); }
  onMelodyBeepCheckChanged(v: boolean) { this.children.forEach(e => e.onMelodyBeepCheckChanged(v)); }
  onMelodyVolumeBarChanged(v: number) { this.children.forEach(e => e.onMelodyVolumeBarChanged(v)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
