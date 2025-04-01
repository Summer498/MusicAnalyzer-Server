import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { ReflectableTimeAndMVCControllerCollection } from "./facade";
import { DMelody } from "./d-melody";
import { RequiredByDMelodySeries } from "../requirement/d-melody/required-by-d-melody-series";
import { IDMelodySeries } from "../interface/d-melody/d-melody-series";

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody>
  implements IDMelodySeries {
  constructor(
    detected_melodies: SerializedTimeAndAnalyzedMelody[],
    controllers: RequiredByDMelodySeries,
  ) {
    super("detected-melody", detected_melodies.map(e => new DMelody(e)));
    controllers.audio.register(this);
    controllers.d_melody.register(this);
    controllers.time_range.register(this);
    controllers.window.register(this)
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
