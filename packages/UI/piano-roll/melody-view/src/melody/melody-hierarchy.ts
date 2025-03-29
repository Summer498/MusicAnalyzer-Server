import { ColorChangeSubscriber } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/color-change-subscriber";
import { HierarchyLevelSubscriber } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-subscriber";
import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-toggle/melody-beep-switcher-subscriber";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-volume/melody-beep-volume-subscriber";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { CollectionHierarchy } from "@music-analyzer/view/src/collection-hierarchy";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { MelodyLayer } from "./melody-layer";
import { RequiredByMelodyHierarchy } from "../requirement/melody/required-melody-hierarchy";

export interface IMelodyHierarchy
  extends
  ColorChangeSubscriber,
  HierarchyLevelSubscriber,
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber,
  TimeRangeSubscriber,
  WindowReflectable { }

export class MelodyHierarchy
  extends CollectionHierarchy<MelodyLayer>
  implements IMelodyHierarchy {
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
