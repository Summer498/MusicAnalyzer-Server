import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { MelodyVM } from "./melody-view-model";
import { MelodyModel } from "./melody-model";
import { Archetype } from "@music-analyzer/irm";

export class MelodyLayer extends CollectionLayer<MelodyVM> {
  constructor(
    layer: number,
    melodies: TimeAndAnalyzedMelody[],
  ) {
    const children = melodies.map(e => new MelodyVM(new MelodyModel(e),));
    super(layer, children);
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
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e => e.setColor(getColor));
  }
  updateColor() {
    this.children.forEach(e => e.updateColor());
  }
}
