import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { TSRController } from "./tsr-tree-controller";
import { TSRModel } from "./tsr-tree-model";


export const getTSRController = (
  hierarchical_melodies: IMelodyModel[][],
  hierarchy_level: HierarchyLevel
) =>
  hierarchical_melodies.map((e, l) => new SvgCollection(
    `layer-${l}`,
    e.map(e => new TSRController(
      new TSRModel(e, hierarchy_level, l),
      e.melody_analysis.implication_realization
    ))
  ));