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
  children: ChordGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
    hierarchy_level: HierarchyLevel
  ) {
    this.children = hierarchical_melodies.map((melodies, layer) => new ChordGravityLayer(melodies, layer, hierarchy_level));
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
  children: ScaleGravityLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
    hierarchy_level: HierarchyLevel
  ){
    this.children = hierarchical_melodies.map((melodies, layer) => new ScaleGravityLayer(melodies, layer, hierarchy_level));
  }
}
