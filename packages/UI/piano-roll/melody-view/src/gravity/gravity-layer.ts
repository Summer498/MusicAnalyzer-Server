import { Gravity } from "./gravity";
import { Layer } from "../abstract/abstract-layer";

export class GravityLayer
  extends Layer<Gravity> {
  constructor(
    layer: number,
    children: Gravity[],
  ) {
    super(layer, children);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
