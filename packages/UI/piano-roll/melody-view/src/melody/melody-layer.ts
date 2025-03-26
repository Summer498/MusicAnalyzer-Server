import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { Melody } from "./melody";
import { RequiredByMelody } from "./melody";
import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { ColorChangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";

export interface RequiredByMelodyLayer
  extends RequiredByMelody { }

export class MelodyLayer
  extends CollectionLayer<Melody>
  implements
  ColorChangeSubscriber,
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber,
  TimeRangeSubscriber,
  WindowReflectable {
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
