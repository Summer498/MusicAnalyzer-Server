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
    controllers.melody_color.addListeners(this.setColor.bind(this));
    controllers.hierarchy.addListeners(this.onChangedLayer.bind(this));
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this))
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
