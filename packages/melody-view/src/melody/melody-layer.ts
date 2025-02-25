import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { MelodyController } from "./melody-controller";
import { MelodyModel } from "./melody-model";
import { Archetype } from "@music-analyzer/irm";

export class MelodyLayer extends CollectionLayer {
  readonly children: MelodyController[];
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number
  ) {
    const children = melodies.map(e => new MelodyController(new MelodyModel(e),));
    super(children, layer);
    this.children = children;
  }
  onMelodyBeepCheckChanged(do_melody_beep: boolean) {
    this.children.forEach(e => {
      (e as MelodyController).onMelodyBeepCheckChanged(do_melody_beep);
    }
    );
  }
  onMelodyVolumeBarChanged(beep_volume: number) {
    this.children.forEach(e =>
      (e as MelodyController).onMelodyVolumeBarChanged(beep_volume)
    );
  }
  onAudioUpdate() {
    super.onAudioUpdate();
    this.children.forEach(e=>(e as MelodyController).onAudioUpdate());
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e=>e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
