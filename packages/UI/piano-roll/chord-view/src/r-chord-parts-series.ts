import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByChordPart } from "./r-chord-parts";

export interface RequiredByChordPartSeries
  extends RequiredByChordPart {
  audio: AudioReflectableRegistry
}
