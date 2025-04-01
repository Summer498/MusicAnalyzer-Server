import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByReduction } from "./required-by-reduction";

export interface RequiredByReductionLayer
  extends RequiredByReduction {
  readonly audio: AudioReflectableRegistry
}