import { CollectionLayerGroup } from "@music-analyzer/view";
import { ScaleGravityLayer } from "./scale-gravity-layer";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class ScaleGravityGroup extends CollectionLayerGroup {
  readonly children: ScaleGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
  ) {
    super();
    this.children = hierarchical_melodies.map((melodies, layer) => new ScaleGravityLayer(melodies, layer));
    this.svg.id = "scale-gravity";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
}
