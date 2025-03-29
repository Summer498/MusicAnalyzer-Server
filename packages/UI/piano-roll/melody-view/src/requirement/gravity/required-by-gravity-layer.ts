import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByGravity } from "./required-by-gravity";

export interface RequiredByGravityLayer
  extends RequiredByGravity {
  readonly audio: AudioReflectableRegistry
}
