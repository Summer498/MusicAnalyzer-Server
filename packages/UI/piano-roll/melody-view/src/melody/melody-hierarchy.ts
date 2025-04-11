import { SetColor } from "@music-analyzer/controllers";
import { MelodyLayer } from "./melody-layer";
import { RequiredByMelodyHierarchy } from "./required-by-melody-hierarchy";
import { IMelodyHierarchy } from "./i-melody-hierarchy";
import { Hierarchy } from "../abstract/abstract-hierarchy";

export class MelodyHierarchy
  extends Hierarchy<MelodyLayer>
  implements IMelodyHierarchy {
  get show() { return this._show; }
  constructor(
    children: MelodyLayer[],
    controllers: RequiredByMelodyHierarchy
  ) {
    super("melody", children);
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.time_range.register(this);
    controllers.window.register(this)
    controllers.melody_beep.register(this);
    controllers.melody_color.register(this);
  }
  onAudioUpdate() {
    super.onAudioUpdate()
    this.show.forEach(e => e.beep())
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  beep() { this.children.forEach(e => e.beep()); }
  onMelodyBeepCheckChanged(v: boolean) { this.children.forEach(e => e.onMelodyBeepCheckChanged(v)); }
  onMelodyVolumeBarChanged(v: number) { this.children.forEach(e => e.onMelodyVolumeBarChanged(v)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
}
