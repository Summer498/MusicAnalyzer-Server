import { CollectionHierarchy } from "@music-analyzer/view";
import { IRSymbolLayer } from "./ir-symbol-layer";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class IRSymbolHierarchy extends CollectionHierarchy{
  readonly children: IRSymbolLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
  ){
    super();
    this.svg.id = "implication-realization archetype";
    this.children = hierarchical_melodies.map((melodies, layer) => new IRSymbolLayer(melodies, layer));
    this.children.forEach(e=>this.svg.appendChild(e.svg));
  }
}
