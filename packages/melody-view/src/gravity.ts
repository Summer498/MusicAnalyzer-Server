import { SvgCollection__old } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { getChordGravitySVG } from "./chord-gravity";
import { getScaleGravitySVG } from "./scale-gravity";

export const getHierarchicalChordGravitySVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection__old(
      `layer-${l}`,
      melodies.map((e, i, a) => getChordGravitySVG(e, i, a, hierarchy_level, l)).flat(2)
    )
  );

export const getHierarchicalScaleGravitySVGs = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection__old(
      `layer-${l}`,
      melodies.map((e, i, a) => getScaleGravitySVG(e, i, a, hierarchy_level, l)).flat(2)
    )
  );
