import { AudioReflectableRegistry } from "./facade/view";
import { RequiredByChordPart } from "./facade/r-part";

export interface RequiredByChordPartSeries
  extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}
