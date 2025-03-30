import { AudioReflectableRegistry } from "./facade";
import { RequiredByChordPart } from "./facade";

export interface RequiredByChordPartSeries
  extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}
