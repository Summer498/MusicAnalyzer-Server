import { RequiredByReduction } from "./required-by-reduction";
import { AudioReflectableRegistry } from "@music-analyzer/view";

export interface RequiredByReductionLayer
  extends RequiredByReduction {
  readonly audio: AudioReflectableRegistry
}