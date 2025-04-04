import { SetColor } from "@music-analyzer/controllers";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyLayer } from "./melody-layer";
import { RequiredByMelodyHierarchy } from "../requirement";
import { IMelodyHierarchy } from "../interface";
import { CollectionHierarchy } from "@music-analyzer/view";

export class MelodyHierarchy
  extends CollectionHierarchy<MelodyLayer>
  implements IMelodyHierarchy {
  get show() { return this._show; }
  constructor(
    hierarchical_melodies: SerializedTimeAndAnalyzedMelody[][],
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
