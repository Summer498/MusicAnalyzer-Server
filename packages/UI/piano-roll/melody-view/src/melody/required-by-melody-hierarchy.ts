import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByMelodyLayer } from "./required-by-melody-layer";

export interface RequiredByMelodyHierarchy
  extends
  RequiredByMelodyLayer,
  RequiredByHierarchy {
  readonly audio: AudioReflectableRegistry
}
