import { Gravity } from "./gravity";
import { IGravityLayer } from "./i-gravity-layer";
import { Layer } from "../abstract/abstract-layer";

export class GravityLayer
  extends Layer<Gravity>
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
