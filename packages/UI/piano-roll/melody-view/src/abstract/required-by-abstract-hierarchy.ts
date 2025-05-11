import { HierarchyLevelController } from "@music-analyzer/controllers";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { MelodyColorController } from "@music-analyzer/controllers";

export interface RequiredByView {
  readonly melody_color: MelodyColorController
}

export interface RequiredByPart {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

export interface RequiredByLayer {
  readonly audio: AudioReflectableRegistry,
}

export interface RequiredByHierarchy {
  readonly hierarchy: HierarchyLevelController,
}
