import { AudioReflectableRegistry } from "../facade/view";
import { RequiredByChordPart } from "./r-part";

export interface RequiredByChordPartSeries
  extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}
