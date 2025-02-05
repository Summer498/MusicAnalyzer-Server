import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { IRSymbolController } from "./ir-symbol-controller";
import { IRSymbolModel } from "./ir-symbol-model";

export const getHIRSymbolController = (
  hierarchical_melodies: IMelodyModel[][],
  hierarchy_level: HierarchyLevel
) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection(
      `layer-${l}`,
      e.map(e => new IRSymbolController(new IRSymbolModel(e, hierarchy_level, l)))
    )
  );
