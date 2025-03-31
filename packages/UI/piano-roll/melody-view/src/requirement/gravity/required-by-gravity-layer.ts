import { AudioReflectableRegistry } from "./facade";
import { RequiredByGravity } from "./required-by-gravity";

export interface RequiredByGravityLayer
  extends RequiredByGravity {
  readonly audio: AudioReflectableRegistry
}
