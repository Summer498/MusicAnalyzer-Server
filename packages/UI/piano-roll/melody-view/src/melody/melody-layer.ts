import { CollectionLayer } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { IMelodyLayer } from "./i-melody-layer";
import { Melody } from "./melody";

export class MelodyLayer
  extends CollectionLayer<Melody>
  implements IMelodyLayer {
  constructor(
    children: Melody[],
    layer: number,
  ) {
    super(layer, children);
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  beep() { this.children.forEach(e => e.beep()); }
  onMelodyBeepCheckChanged(v: boolean) { this.children.forEach(e => e.onMelodyBeepCheckChanged(v)); }
  onMelodyVolumeBarChanged(v: number) { this.children.forEach(e => e.onMelodyVolumeBarChanged(v)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
