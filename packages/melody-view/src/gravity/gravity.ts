import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { getChordGravityController } from "../chord-gravity/chord-gravity";
import { getScaleGravityController } from "../scale-gravity/scale-gravity";

export class ChordGravityLayer extends SvgCollection {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
    hierarchy_level: HierarchyLevel
  ) {
    const children = melodies.map((e, i, a) => getChordGravityController(e, i, a, hierarchy_level, layer)).flat(2);
    super(children);
    this.svg.id = `layer-${layer}`;
  }
}

export class ChordGravityGroup {
  readonly svg: SVGGElement;
  readonly children: ChordGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
    hierarchy_level: HierarchyLevel
  ) {
    this.children = hierarchical_melodies.map((melodies, layer) => new ChordGravityLayer(melodies, layer, hierarchy_level));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "chord-gravity";
    this.children.forEach(e=> this.svg.appendChild(e.svg));
  }
}

export class ScaleGravityLayer extends SvgCollection {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
    hierarchy_level: HierarchyLevel
  ) {
    const children = melodies.map((e, i, a) => getScaleGravityController(e, i, a, hierarchy_level, layer)).flat(2);
    super(children);
    this.svg.id = `layer-${layer}`;
  }
}

export class ScaleGravityGroup {
  readonly svg: SVGGElement;
  readonly children: ScaleGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
    hierarchy_level: HierarchyLevel
  ){
    this.children = hierarchical_melodies.map((melodies, layer) => new ScaleGravityLayer(melodies, layer, hierarchy_level));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "scale-gravity";
    this.children.forEach(e=> this.svg.appendChild(e.svg));
  }
}
