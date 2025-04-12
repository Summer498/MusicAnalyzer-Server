import { SetColor } from "@music-analyzer/controllers";
import { ReductionLayer } from "./reduction-layer";
import { RequiredByReductionHierarchy } from "./required-by-reduction-hierarchy";
import { Hierarchy } from "../abstract/abstract-hierarchy";

export class ReductionHierarchy
  extends Hierarchy<ReductionLayer> {
  constructor(
    children: ReductionLayer[],
    controllers: RequiredByReductionHierarchy
  ) {
    super("time-span-reduction", children);
    controllers.melody_color.addListeners(this.setColor);
    controllers.hierarchy.addListeners(this.onChangedLayer);
    controllers.audio.addListeners(this.onAudioUpdate);
    controllers.window.addListeners(this.onWindowResized);
    controllers.time_range.addListeners(this.onTimeRangeChanged)
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value >= e.layer);
    this.show.forEach(e => e.renewStrong(value));
    visible_layer.forEach(e => e.renewStrong(value));
    this.setShow(visible_layer);
  }
  readonly setColor: SetColor = f => this.children.forEach(e => e.setColor(f))
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
}
