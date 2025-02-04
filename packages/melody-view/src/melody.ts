import { SvgCollection } from "@music-analyzer/view";
import { MelodyController } from "./melody-controller";
import { HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";

export { getDMelodyControllers } from "./d-melody";
export const getHierarchicalMelodyControllers = (hierarchical_melodies: IMelodyModel[][], hierarchy_level: HierarchyLevel, melody_beep_switcher: MelodyBeepSwitcher, melody_beep_volume: MelodyBeepVolume) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection(
      `layer-${l}`,
      e.map(e => new MelodyController(e, hierarchy_level, melody_beep_switcher, melody_beep_volume, l))
    )
  );