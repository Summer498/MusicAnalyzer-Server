import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { CollectionLayer } from "./facade";
import { Gravity } from "./gravity";
import { IGravityLayer } from "../interface/gravity/gravity-layer";

export class GravityLayer
  extends CollectionLayer<Gravity>
  implements IGravityLayer {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    melodies: SerializedTimeAndAnalyzedMelody[],
    layer: number,
  ) {
    const next = melodies.slice(1);
    super(layer, next.map((n, i) => {
      const e = melodies[i];
      const gravity = e.melody_analysis[mode];
      return gravity && new Gravity(e, layer, n, gravity);
    }).filter(e => e !== undefined));
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
