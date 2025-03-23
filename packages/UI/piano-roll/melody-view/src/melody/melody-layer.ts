import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer, WindowReflectable } from "@music-analyzer/view";
import { Melody, RequiredByMelody } from "./melody";
import { MelodyBeepSwitcherSubscriber, MelodyBeepVolumeSubscriber, TimeRangeSubscriber } from "@music-analyzer/controllers";
import { ColorChangeSubscriber, SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color-selector";

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
