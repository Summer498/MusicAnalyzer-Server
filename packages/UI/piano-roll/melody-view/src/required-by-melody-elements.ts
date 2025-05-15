import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, MelodyColorController, TimeRangeController } from "@music-analyzer/controllers";

export interface RequiredByMelodyElements {
  readonly gravity: GravityController
  readonly audio: AudioReflectableRegistry,
  readonly d_melody: DMelodyController,
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController

  readonly melody_beep: MelodyBeepController
  readonly melody_color: MelodyColorController
  readonly hierarchy: HierarchyLevelController,
}
