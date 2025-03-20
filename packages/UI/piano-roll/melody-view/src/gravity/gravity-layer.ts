import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { Gravity } from "./gravity";

export class GravityLayer 
  extends CollectionLayer<Gravity> {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    melodies: TimeAndAnalyzedMelody[],
    layer: number,
  ) {
    const next = melodies.slice(1);
    super(layer, next.map((n, i) => {
      const e = melodies[i];
      const gravity = e.melody_analysis[mode];
      return gravity && new Gravity(e, layer, n, gravity);
    }).filter(e => e !== undefined));
  }
}
