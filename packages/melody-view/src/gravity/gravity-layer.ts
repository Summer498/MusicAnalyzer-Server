import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { GravityVM } from "./gravity-view-model";
import { GravityModel } from "./gravity-model";

export class GravityLayer extends CollectionLayer<GravityVM> {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    layer: number,
    melodies: TimeAndAnalyzedMelody[],
  ) {
    const next = melodies.slice(1);
    const children = next.map((n, i) => {
      const e = melodies[i];
      const gravity = e.melody_analysis[mode];
      return gravity && new GravityVM(new GravityModel(e, n, gravity, layer));
    }).filter(e => e !== undefined);
    super(layer, children);
  }
}
