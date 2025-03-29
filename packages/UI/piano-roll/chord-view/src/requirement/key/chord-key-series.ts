import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByChordKey } from "./chord-key";

export interface RequiredByChordKeySeries
  extends RequiredByChordKey {
  readonly audio: AudioReflectableRegistry
}
