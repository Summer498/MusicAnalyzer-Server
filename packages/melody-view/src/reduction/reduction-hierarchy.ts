import { CollectionHierarchy } from "@music-analyzer/view";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { ReductionLayer } from "./reduction-layer";
import { Archetype } from "@music-analyzer/irm";

export class ReductionHierarchy extends CollectionHierarchy {
  readonly svg: SVGGElement;
  readonly children: ReductionLayer[];
  constructor(
    hierarchical_melodies: TimeAndAnalyzedMelody[][]
  ) {
    super();
    this.children = hierarchical_melodies.map((e, l) => new ReductionLayer(e, l));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-reduction";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
  onChangedLayer(value: number): void {
    const visible_layer = this.children.filter(
      layer => value >= layer.layer
    );
    this.show.forEach(layer => (layer as ReductionLayer).renewStrong(value));
    visible_layer.forEach(layer => (layer as ReductionLayer).renewStrong(value));
    this.setShow(visible_layer);
  }
  setColor(getColor: (archetype: Archetype) => string) {
    this.children.forEach(e=>e.setColor(getColor));
  }
  updateColor() { this.children.forEach(e => e.updateColor()); }
}
