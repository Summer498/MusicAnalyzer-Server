import { CollectionHierarchy } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";
import { ReductionLayer } from "./reduction-layer";
import { IReductionHierarchy } from "./i-reduction-hierarchy";
import { RequiredByReductionHierarchy } from "./required-by-reduction-hierarchy";

export class ReductionHierarchy
  extends CollectionHierarchy<ReductionLayer>
  implements IReductionHierarchy {
  constructor(
    children: ReductionLayer[],
    controllers: RequiredByReductionHierarchy
  ) {
    super("time-span-reduction", children);
    controllers.melody_color.register(this);
    controllers.hierarchy.register(this);
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value >= e.layer);
    this.show.forEach(e => e.renewStrong(value));
    visible_layer.forEach(e => e.renewStrong(value));
    this.setShow(visible_layer);
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
