import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController, DMelodyControllerSubscriber } from "@music-analyzer/controllers";
import { DMelody, RequiredByDMelody } from "./d-melody";

export interface RequiredByDMelodySeries
  extends RequiredByDMelody {
  readonly d_melody: DMelodyController,
  readonly audio: AudioReflectableRegistry,
}

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody>
  implements DMelodyControllerSubscriber {
  constructor(
    detected_melodies: TimeAndAnalyzedMelody[],
    controllers: RequiredByDMelodySeries,
  ) {
    super("detected-melody", detected_melodies.map(e => new DMelody(e, controllers)));
    controllers.audio.register(this);
    controllers.d_melody.register(this);
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
}
