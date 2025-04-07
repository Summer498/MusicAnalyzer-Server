import { CollectionHierarchy } from "@music-analyzer/view";
import { GravityLayer } from "./gravity-layer";
import { IGravityHierarchy } from "./i-gravity-hierarchy";
import { RequiredByGravityHierarchy } from "./required-by-gravity-hierarchy";

export class GravityHierarchy
  extends CollectionHierarchy<GravityLayer>
  implements IGravityHierarchy {
  constructor(
    id: string,
    children: GravityLayer[],
    controllers: RequiredByGravityHierarchy,
  ) {
    super(id, children);
    controllers.switcher.register(this);
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onUpdateGravityVisibility(visible: boolean) { this.svg.style.visibility = visible ? "visible" : "hidden"; }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
