import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer, WindowReflectable } from "@music-analyzer/view";
import { Melody, RequiredByMelody } from "./melody";
import { MelodyBeepSwitcherSubscriber, MelodyBeepVolumeSubscriber, TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface RequiredByMelodyLayer
  extends RequiredByMelody { }

export class MelodyLayer
  extends CollectionLayer<Melody>
  implements
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber,
  TimeRangeSubscriber,
  WindowReflectable {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: RequiredByMelodyLayer
  ) {
    super(layer, melodies.map(e => new Melody(e, controllers)));
  }
  beep() { this.children.forEach(e => e.beep()); }
  onMelodyBeepCheckChanged(v: boolean) { this.children.forEach(e => e.onMelodyBeepCheckChanged(v)); }
  onMelodyVolumeBarChanged(v: number) { this.children.forEach(e => e.onMelodyVolumeBarChanged(v)); }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}
