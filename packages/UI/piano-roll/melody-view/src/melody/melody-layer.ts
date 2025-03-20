import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { Melody } from "./melody";
import { RequiredByMelody } from "./melody/melody";

export interface RequiredByMelodyLayer
  extends RequiredByMelody {

}

export class MelodyLayer
  extends CollectionLayer<Melody> {
  constructor(
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
    controllers: RequiredByMelodyLayer
  ) {
    super(layer, melodies.map(e => new Melody(e, controllers)));
  }
  beep() {
    this.children.forEach(e => e.beep());
  }
}
