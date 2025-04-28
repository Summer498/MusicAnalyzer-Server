import { GravityLayer } from "./gravity-layer";
import { RequiredByGravityHierarchy } from "./required-by-gravity-hierarchy";
import { Hierarchy } from "../abstract/abstract-hierarchy";

export class GravityHierarchy
  extends Hierarchy<GravityLayer> {
  constructor(
    id: string,
    children: GravityLayer[],
    controllers: RequiredByGravityHierarchy,
  ) {
    super(id, children);
    controllers.switcher.addListeners(this.onUpdateGravityVisibility.bind(this));
    controllers.hierarchy.addListeners(this.onChangedLayer.bind(this));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
}
