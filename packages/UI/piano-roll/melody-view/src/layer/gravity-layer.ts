import { CollectionLayer } from "@music-analyzer/view";
import { Gravity } from "../part";
import { IGravityLayer } from "../i-layer";

export class GravityLayer
  extends CollectionLayer<Gravity>
  implements IGravityLayer {
  constructor(
    layer: number,
    children: Gravity[],
  ) {
    super(layer, children);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
