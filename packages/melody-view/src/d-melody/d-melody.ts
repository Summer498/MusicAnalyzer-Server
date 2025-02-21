import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelodyController } from "./d-melody-controller";
import { DMelodyModel } from "./d-melody-model";

export class DMelodyGroup extends ReflectableTimeAndMVCControllerCollection {
  constructor(
    detected_melodies: TimeAndAnalyzedMelody[],
  ) {
    const children = detected_melodies.map(e => new DMelodyController(new DMelodyModel(e)));
    super(children);
    this.svg.id = "detected-melody";
  }
}
