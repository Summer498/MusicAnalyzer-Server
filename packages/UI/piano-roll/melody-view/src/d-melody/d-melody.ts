import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelodyVM } from "./d-melody-view-model";
import { DMelodyController, DMelodyControllerSubscriber } from "@music-analyzer/controllers";

export class DMelodyGroup
  extends ReflectableTimeAndMVCControllerCollection<DMelodyVM>
  
implements DMelodyControllerSubscriber {
  constructor(
    detected_melodies: TimeAndAnalyzedMelody[],
    readonly controllers: [DMelodyController],
  ) {
    super("detected-melody", detected_melodies.map(e => new DMelodyVM(e)));
    controllers.forEach(e => e.register(this));
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
}
