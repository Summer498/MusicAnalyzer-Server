import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { DMelodyController } from "./d-melody-controller";
import { AccompanyToAudioRegistry, SvgCollection } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";

export class DMelodyGroup extends SvgCollection {
  constructor(
    detected_melodies: IMelodyModel[],
  ) {
    const children = detected_melodies.map(e => new DMelodyController(new DMelodyModel(e)));
    super(children);
    this.svg.id = "detected-melody";
    AccompanyToAudioRegistry.instance.register(this);
  }
}
