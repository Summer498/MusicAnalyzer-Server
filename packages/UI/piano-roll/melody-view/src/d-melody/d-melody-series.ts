import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelody } from "./d-melody";
import { RequiredByDMelodySeries } from "../requirement";
import { IDMelodySeries } from "../interface";

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
