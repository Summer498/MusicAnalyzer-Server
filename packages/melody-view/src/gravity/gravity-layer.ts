import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { GravityController } from "./gravity-controller";
import { GravityModel } from "./gravity-model";

export class GravityLayer extends CollectionLayer {
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    melodies: IMelodyModel[],
    layer: number,
  ) {
    const next = melodies.slice(1);
    const children = next.map((n, i) => {
      const e = melodies[i];
      const gravity = e.melody_analysis[mode];
      return gravity && new GravityController(new GravityModel(e, n, gravity, layer));
    }).filter(e => e !== undefined);
    super(children, layer);
    this.svg.id = `layer-${layer}`;
  }
}
