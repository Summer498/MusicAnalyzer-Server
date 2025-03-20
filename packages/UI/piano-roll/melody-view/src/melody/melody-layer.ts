import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { Melody } from "./melody";
import { ColorChangeSubscriber, hasArchetype, MelodyBeepController, MelodyBeepSwitcherSubscriber, MelodyBeepVolumeSubscriber, MelodyColorController } from "@music-analyzer/controllers";

export class MelodyLayer
  extends CollectionLayer<Melody>
  implements
  MelodyBeepSwitcherSubscriber,
  MelodyBeepVolumeSubscriber,
  ColorChangeSubscriber {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [MelodyBeepController, MelodyColorController]
  ) {
    super(layer, melodies.map(e => new Melody(e)));
    controllers.forEach(e => e.register(this));
  }
  onAudioUpdate() {
    super.onAudioUpdate();
    this.children.forEach(e => e.onAudioUpdate());
  }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) { this.children.forEach(e => e.onMelodyBeepCheckChanged(do_melody_beep)); }
  onMelodyVolumeBarChanged(beep_volume: number) { this.children.forEach(e => e.onMelodyVolumeBarChanged(beep_volume)); }
  setColor(getColor: (e: hasArchetype) => string) { this.children.forEach(e => e.setColor(getColor)); }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
