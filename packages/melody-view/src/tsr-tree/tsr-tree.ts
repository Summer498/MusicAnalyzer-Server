import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { TSRController } from "./tsr-tree-controller";


export const getTSR_SVGs = (
  hierarchical_melodies: IMelodyModel[][],
  hierarchy_level: HierarchyLevel
) =>
  hierarchical_melodies.map((e, l) => new SvgCollection(
    `layer-${l}`,
    e.map(e => new TSRController(e, hierarchy_level, l))
  ));