import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { Gravity } from "../part/gravity";
import { IGravityLayer } from "../i-layer/i-gravity-layer";
import { CollectionLayer } from "@music-analyzer/view";

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
