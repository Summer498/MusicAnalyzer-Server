import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { IRSymbolController } from "./ir-symbol-controller";
import { IRSymbolModel } from "./ir-symbol-model";

export class IRSymbolLayer extends SvgCollection {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
    hierarchy_level: HierarchyLevel
  ) {
    const children = melodies.map(e => new IRSymbolController(new IRSymbolModel(e, hierarchy_level, layer)));
    super(children);
    this.svg.id = `layer-${layer}`;
  }
}

export class IRSymbolGroup {
  svg: SVGGElement;
  children: IRSymbolLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
    hierarchy_level: HierarchyLevel
  ){
    this.children = hierarchical_melodies.map((melodies, layer) => new IRSymbolLayer(melodies, layer, hierarchy_level));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  }
}
