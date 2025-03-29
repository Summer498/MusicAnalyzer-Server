import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByChordRoman } from "./r-chord-roman";

export interface RequiredByChordRomanSeries
  extends RequiredByChordRoman {
  readonly audio: AudioReflectableRegistry
}
