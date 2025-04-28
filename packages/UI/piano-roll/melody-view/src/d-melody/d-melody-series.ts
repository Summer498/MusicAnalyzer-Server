import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { DMelody } from "./d-melody";
import { RequiredByDMelodySeries } from "./required-by-d-melody-series";

export class DMelodySeries
  extends ReflectableTimeAndMVCControllerCollection<DMelody> {
  constructor(
    children: DMelody[],
    controllers: RequiredByDMelodySeries,
  ) {
    super("detected-melody", children);
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.d_melody.addListeners(this.onDMelodyVisibilityChanged.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this))
  }
  onDMelodyVisibilityChanged(visible: boolean) {
    const visibility = visible ? "visible" : "hidden";
    this.svg.style.visibility = visibility;
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
