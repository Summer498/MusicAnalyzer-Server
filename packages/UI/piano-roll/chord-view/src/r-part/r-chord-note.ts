import { AudioReflectableRegistry } from "./facade";
import { RequiredByChordPart } from "./r-chord-parts";

export interface RequiredByChordNote
extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}
