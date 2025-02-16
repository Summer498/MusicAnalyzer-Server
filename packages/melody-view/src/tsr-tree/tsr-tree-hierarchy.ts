import { CollectionHierarchy } from "@music-analyzer/view";
import { TSRLayer } from "./tsr-tree-layer";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export class TSRHierarchy extends CollectionHierarchy {
  readonly svg: SVGGElement;
  readonly children: TSRLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][]
  ) {
    super();
    this.children = hierarchical_melodies.map((e, l) => new TSRLayer(e, l));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-reduction";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
  onChangedLayer(value: number): void {
    const visible_layer = this.children.filter(
      layer => value >= layer.layer
    );
    this.show.forEach(layer => (layer as TSRLayer).renewStrong(value));
    visible_layer.forEach(layer => (layer as TSRLayer).renewStrong(value));
    this.setShow(visible_layer);
  }
}
