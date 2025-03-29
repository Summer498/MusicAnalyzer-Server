import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByChordName } from "./chord-name";

export interface RequiredByChordNameSeries
  extends RequiredByChordName {
  readonly audio: AudioReflectableRegistry
}
