import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { Melody } from "../part";
import { IMelodyLayer } from "../i-layer";

export class MelodyLayer
  extends CollectionLayer<Melody>
  implements IMelodyLayer {
  constructor(
    melodies: SerializedTimeAndAnalyzedMelody[],
    layer: number,
  ) {
    super(layer, melodies.map(e => new Melody(e)));
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  beep() { this.children.forEach(e => e.beep()); }
  onMelodyBeepCheckChanged(v: boolean) { this.children.forEach(e => e.onMelodyBeepCheckChanged(v)); }
  onMelodyVolumeBarChanged(v: number) { this.children.forEach(e => e.onMelodyVolumeBarChanged(v)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
