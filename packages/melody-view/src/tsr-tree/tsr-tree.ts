import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { TSRController } from "./tsr-tree-controller";
import { TSRModel } from "./tsr-tree-model";


export class TSRLayer extends SvgCollection {
  constructor(
    melodies: IMelodyModel[],
    layer: number,
    hierarchy_level: HierarchyLevel,
  ) {
    const children = melodies.map(e => new TSRController(
      new TSRModel(e, hierarchy_level, layer),
      e.melody_analysis.implication_realization
    ));
    super(children);
    this.svg.id = `layer-${layer}`;
  }
}

export class TSRGroup {
  readonly svg: SVGGElement;
  readonly children: TSRLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
    hierarchy_level: HierarchyLevel
  ) {
    this.children = hierarchical_melodies.map((e, l) => new TSRLayer(e, l, hierarchy_level));
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "time-span-reduction";
    this.children.forEach(e => this.svg.appendChild(e.svg));
  }
}
