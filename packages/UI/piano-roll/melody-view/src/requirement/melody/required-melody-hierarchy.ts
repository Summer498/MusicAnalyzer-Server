import { HierarchyLevelController } from "./facade";
import { AudioReflectableRegistry } from "./facade";
import { RequiredByMelodyLayer } from "./required-melody-layer";

export interface RequiredByMelodyHierarchy
  extends RequiredByMelodyLayer {
  readonly hierarchy: HierarchyLevelController
  readonly audio: AudioReflectableRegistry
}
