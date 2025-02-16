import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { getScaleGravityController } from "./scale-gravity-controller";

export class ScaleGravityLayer extends CollectionLayer {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
  ) {
    const children = melodies.map((e, i, a) => getScaleGravityController(e, i, a, layer)).flat(2);
    super(children, layer);
    this.svg.id = `layer-${layer}`;
  }
}
