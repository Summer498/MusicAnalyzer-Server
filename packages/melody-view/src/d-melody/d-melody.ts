import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelodyVM } from "./d-melody-view-model";
import { DMelodyModel } from "./d-melody-model";

export class DMelodyGroup extends ReflectableTimeAndMVCControllerCollection<DMelodyVM> {
  constructor(detected_melodies: TimeAndAnalyzedMelody[]) {
    super("detected-melody", detected_melodies.map(e => new DMelodyVM(new DMelodyModel(e))));
  }
}
