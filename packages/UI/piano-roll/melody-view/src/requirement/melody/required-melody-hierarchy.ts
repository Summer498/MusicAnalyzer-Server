import { HierarchyLevelController } from "@music-analyzer/controllers";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByMelodyLayer } from "./required-melody-layer";

export interface RequiredByMelodyHierarchy
  extends RequiredByMelodyLayer {
  readonly hierarchy: HierarchyLevelController
  readonly audio: AudioReflectableRegistry
}
