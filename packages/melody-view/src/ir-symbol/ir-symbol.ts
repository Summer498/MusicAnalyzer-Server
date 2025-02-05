import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { IRSymbolController } from "./ir-symbol-controller";

export const getHierarchicalIRSymbolSVGs = (
  hierarchical_melodies: IMelodyModel[][],
  hierarchy_level: HierarchyLevel
) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection(
      `layer-${l}`,
      e.map(e => new IRSymbolController(e, hierarchy_level, l))
    )
  );
