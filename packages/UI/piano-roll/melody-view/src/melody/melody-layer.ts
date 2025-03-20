import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { Melody } from "./melody";
import { MelodyBeepController, MelodyColorController } from "@music-analyzer/controllers";

export class MelodyLayer
  extends CollectionLayer<Melody> {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [MelodyBeepController, MelodyColorController]
  ) {
    super(layer, melodies.map(e => new Melody(e, controllers)));
  }
  onAudioUpdate() {
    super.onAudioUpdate();
    this.children.forEach(e => e.onAudioUpdate());
  }
}
