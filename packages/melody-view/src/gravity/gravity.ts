import { SvgCollection } from "@music-analyzer/view";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { getChordGravityController } from "../chord-gravity/chord-gravity";
import { getScaleGravityController } from "../scale-gravity/scale-gravity";

export const getHChordGravityController = (hierarchical_melodies: IMelodyModel[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection(
      `layer-${l}`,
      melodies.map((e, i, a) => getChordGravityController(e, i, a, hierarchy_level, l)).flat(2)
    )
  );

export const getHScaleGravityController = (hierarchical_melodies: IMelodyModel[][], hierarchy_level: HierarchyLevel) =>
  hierarchical_melodies.map((melodies, l) =>
    new SvgCollection(
      `layer-${l}`,
      melodies.map((e, i, a) => getScaleGravityController(e, i, a, hierarchy_level, l)).flat(2)
    )
  );
