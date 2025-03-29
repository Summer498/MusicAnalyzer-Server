import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { DMelody } from "./d-melody/d-melody";
import { RequiredByDMelodySeries } from "../requirement/d-melody/required-by-d-melody-series";
import { IDMelodySeries } from "../interface/d-melody/d-melody-series";

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody>
  implements IDMelodySeries {
  constructor(
    detected_melodies: TimeAndAnalyzedMelody[],
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
