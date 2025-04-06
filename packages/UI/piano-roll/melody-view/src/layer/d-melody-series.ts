import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelody } from "../part/d-melody";
import { RequiredByDMelodySeries } from "../r-layer/required-by-d-melody-series";
import { IDMelodySeries } from "../i-layer/i-d-melody-series";

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody>
  implements IDMelodySeries {
  constructor(
    children: DMelody[],
    controllers: RequiredByDMelodySeries,
  ) {
    super("detected-melody", children);
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
