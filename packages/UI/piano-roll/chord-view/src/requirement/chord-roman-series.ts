import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { RequiredByChordRoman } from "./chord-roman";

export interface RequiredByChordRomanSeries
  extends RequiredByChordRoman {
  readonly audio: AudioReflectableRegistry
}
