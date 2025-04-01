import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByChordPart } from "../r-part";

export interface RequiredByChordPartSeries
  extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}
