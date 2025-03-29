import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { Melody } from "./melody/melody";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";
import { IMelodyLayer } from "../interface/melody/melody-layer";

export class MelodyLayer
  extends CollectionLayer<Melody>
  implements IMelodyLayer {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
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
