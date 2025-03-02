import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GravityLayer } from "./gravity-layer";

export class GravityHierarchy extends CollectionHierarchy<GravityLayer> {
  readonly children: GravityLayer[];
  constructor(
    mode: "chord_gravity" | "scale_gravity",
    hierarchical_melodies: TimeAndAnalyzedMelody[][],
  ) {
    super();
    this.children = hierarchical_melodies.map((melodies, l) => new GravityLayer(mode, l, melodies));
    this.svg.id = "scale-gravity";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
}
