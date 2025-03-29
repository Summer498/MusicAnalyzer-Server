import { RequiredByReduction } from "./required-by-reduction";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";

export interface RequiredByReductionLayer
  extends RequiredByReduction {
  readonly audio: AudioReflectableRegistry
}