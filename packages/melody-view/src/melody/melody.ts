import { SvgCollection } from "@music-analyzer/view";
import { MelodyController } from "./melody-controller";
import { HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { MelodyModel } from "./melody-model";

export { DMelodyGroup } from "../d-melody/d-melody";

export class MelodyLayer extends SvgCollection {
  constructor(
    melodies: IMelodyModel[],
    hierarchy_level: HierarchyLevel,
    melody_beep_switcher: MelodyBeepSwitcher,
    melody_beep_volume: MelodyBeepVolume,
    layer: number
  ){
    const children = melodies.map(e => new MelodyController(
      new MelodyModel(e, layer),
      hierarchy_level,
      melody_beep_switcher,
      melody_beep_volume
    ));
    super(children);
    this.svg.id = `layer-${layer}`;
  }
}

export class MelodyGroup {
  children: MelodyLayer[];
  constructor(
    hierarchical_melodies: IMelodyModel[][],
    hierarchy_level: HierarchyLevel,
    melody_beep_switcher: MelodyBeepSwitcher,
    melody_beep_volume: MelodyBeepVolume
  ){
    this.children = hierarchical_melodies.map((melodies, layer) =>
      new MelodyLayer(
        melodies,
        hierarchy_level,
        melody_beep_switcher,
        melody_beep_volume,
        layer
      )
    );
  }
}
