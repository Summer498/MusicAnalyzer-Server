import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelody } from "./d-melody";
import { IDMelodySeries } from "./i-d-melody-series";
import { RequiredByDMelodySeries } from "./required-by-d-melody-series";

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody>
  implements IDMelodySeries {
  constructor(
    children: DMelody[],
    controllers: RequiredByDMelodySeries,
  ) {
    super("detected-melody", children);
    controllers.audio.addListeners(this.onAudioUpdate);
    controllers.d_melody.addListeners(this.onDMelodyVisibilityChanged);
    controllers.time_range.addListeners(this.onTimeRangeChanged);
    controllers.window.addListeners(this.onWindowResized)
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
