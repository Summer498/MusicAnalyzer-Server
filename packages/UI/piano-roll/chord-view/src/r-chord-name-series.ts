import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByChordName } from "./r-chord-name";

export interface RequiredByChordNameSeries
  extends RequiredByChordName {
  readonly audio: AudioReflectableRegistry
}
