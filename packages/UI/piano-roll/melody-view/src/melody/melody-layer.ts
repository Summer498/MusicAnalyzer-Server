import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { MelodyVM } from "./melody-view-model";
import { MelodyModel } from "./melody-model";

export class MelodyLayer 
extends CollectionLayer<MelodyVM> {
  constructor(melodies: TimeAndAnalyzedMelody[], layer: number) {
    super(layer, melodies.map(e => new MelodyVM(e)));
  }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) {
    this.children.forEach(e => e.onMelodyBeepCheckChanged(do_melody_beep));
  }
  onMelodyVolumeBarChanged(beep_volume: number) {
    this.children.forEach(e => e.onMelodyVolumeBarChanged(beep_volume));
  }
  onAudioUpdate() {
    super.onAudioUpdate();
    this.children.forEach(e => e.onAudioUpdate());
  }
  setColor(getColor: (e: MelodyModel) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
