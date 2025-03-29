import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { CollectionLayer } from "@music-analyzer/view/src/collection-layer";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { Melody } from "./melody/melody";
import { MelodyBeepSwitcherSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-toggle/melody-beep-switcher-subscriber";
import { MelodyBeepVolumeSubscriber } from "@music-analyzer/controllers/src/melody-beep-controller/melody-beep-volume/melody-beep-volume-subscriber";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { ColorChangeSubscriber } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/color-change-subscriber";
import { SetColor } from "@music-analyzer/controllers/src/color-selector.ts/irm-color/set-color";


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
