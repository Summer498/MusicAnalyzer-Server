import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByChordPart } from "./r-chord-parts";

export interface RequiredByChordNote
extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}
