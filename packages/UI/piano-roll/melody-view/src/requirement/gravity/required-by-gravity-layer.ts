import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByGravity } from "./required-by-gravity";

export interface RequiredByGravityLayer
  extends RequiredByGravity {
  readonly audio: AudioReflectableRegistry
}
