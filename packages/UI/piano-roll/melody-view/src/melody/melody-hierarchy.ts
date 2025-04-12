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
    controllers.hierarchy.addListeners(this.onChangedLayer);
    controllers.audio.addListeners(this.onAudioUpdate);
    controllers.time_range.addListeners(this.onTimeRangeChanged);
    controllers.window.addListeners(this.onWindowResized)
    controllers.melody_beep.checkbox.addListeners(this.onMelodyBeepCheckChanged);
    controllers.melody_beep.volume.addListeners(this.onMelodyVolumeBarChanged);
    controllers.melody_color.addListeners(this.setColor);
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
