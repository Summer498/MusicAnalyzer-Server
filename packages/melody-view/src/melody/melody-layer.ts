import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { MelodyController } from "./melody-controller";
import { MelodyModel } from "./melody-model";

export class MelodyLayer extends CollectionLayer {
  constructor(
    melodies: IMelodyModel[],
    layer: number
  ) {
    const children = melodies.map(e => new MelodyController(new MelodyModel(e),));
    super(children, layer);
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
}
