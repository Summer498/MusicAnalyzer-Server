import { CollectionHierarchy } from "@music-analyzer/view";
import { ChordGravityLayer } from "./chord-gravity-layer";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class ChordGravityHierarchy extends CollectionHierarchy {
  readonly children: ChordGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
  ) {
    super();
    this.children = hierarchical_melodies.map((melodies, layer) => new ChordGravityLayer(melodies, layer));
    this.svg.id = "chord-gravity";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
}

