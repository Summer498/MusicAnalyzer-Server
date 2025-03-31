import { AudioReflectableRegistry } from "./facade";
import { RequiredByReduction } from "./required-by-reduction";

export interface RequiredByReductionLayer
  extends RequiredByReduction {
  readonly audio: AudioReflectableRegistry
}