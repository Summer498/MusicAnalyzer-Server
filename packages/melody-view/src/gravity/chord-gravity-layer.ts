import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { CollectionLayer } from "@music-analyzer/view";
import { getChordGravityController } from "./chord-gravity-controller";

export class ChordGravityLayer extends CollectionLayer {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
  ) {
    const children = melodies.map((e, i, a) => getChordGravityController(e, i, a, layer)).flat(2);
    super(children, layer);
    this.svg.id = `layer-${layer}`;
  }
}
