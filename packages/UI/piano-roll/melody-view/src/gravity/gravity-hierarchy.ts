import { GravityLayer } from "./gravity-layer";
import { IGravityHierarchy } from "./i-gravity-hierarchy";
import { RequiredByGravityHierarchy } from "./required-by-gravity-hierarchy";
import { Hierarchy } from "../abstract/abstract-hierarchy";

export class GravityHierarchy
  extends Hierarchy<GravityLayer>
  implements IGravityHierarchy {
  constructor(
    id: string,
    children: GravityLayer[],
    controllers: RequiredByGravityHierarchy,
  ) {
    super(id, children);
    controllers.switcher.addListeners(this.onUpdateGravityVisibility);
    controllers.hierarchy.addListeners(this.onChangedLayer);
    controllers.audio.addListeners(this.onAudioUpdate);
    controllers.window.addListeners(this.onWindowResized);
    controllers.time_range.addListeners(this.onTimeRangeChanged);
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
}
