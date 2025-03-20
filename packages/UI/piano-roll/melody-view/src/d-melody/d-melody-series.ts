import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController, DMelodyControllerSubscriber } from "@music-analyzer/controllers";
import { DMelody } from "./d-melody";

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody>
  implements DMelodyControllerSubscriber {
  constructor(
    detected_melodies: TimeAndAnalyzedMelody[],
    readonly controllers: [DMelodyController, AudioReflectableRegistry, WindowReflectableRegistry],
  ) {
    super("detected-melody", detected_melodies.map(e => new DMelody(e)));
    controllers.forEach(e => e.register(this));
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
}
