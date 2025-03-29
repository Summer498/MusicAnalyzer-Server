import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByChordKey } from "./r-chord-key";

export interface RequiredByChordKeySeries
  extends RequiredByChordKey {
  readonly audio: AudioReflectableRegistry
}
