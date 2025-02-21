import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { DMelodyController } from "./d-melody-controller";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";

export class DMelodyGroup extends ReflectableTimeAndMVCControllerCollection {
  constructor(
    detected_melodies: IMelodyModel[],
  ) {
    const children = detected_melodies.map(e => new DMelodyController(new DMelodyModel(e)));
    super(children);
    this.svg.id = "detected-melody";
  }
}
