import { HierarchyLevelController } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-controller";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByMelodyLayer } from "./required-melody-layer";

export interface RequiredByMelodyHierarchy
  extends RequiredByMelodyLayer {
  readonly hierarchy: HierarchyLevelController
  readonly audio: AudioReflectableRegistry
}
