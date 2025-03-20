import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer, WindowReflectableRegistry } from "@music-analyzer/view";
import { Melody } from "./melody";
import { MelodyBeepController, MelodyColorController } from "@music-analyzer/controllers";

export class MelodyLayer
  extends CollectionLayer<Melody> {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: [MelodyColorController, MelodyBeepController, WindowReflectableRegistry]
  ) {
    super(layer, melodies.map(e => new Melody(e, controllers)));
  }
  beep() {
    this.children.forEach(e => e.beep());
  }
}
