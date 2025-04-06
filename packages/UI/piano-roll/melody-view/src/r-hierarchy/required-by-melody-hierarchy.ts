import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByMelodyLayer } from "../r-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByMelodyHierarchy
  extends
  RequiredByMelodyLayer,
  RequiredByHierarchy {
  readonly audio: AudioReflectableRegistry
}
