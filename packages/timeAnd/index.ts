import { Chord, Scale } from "../TonalObjects";
import { MelodyAnalysis } from "../melodyAnalyze";

export type TimeAnd = { begin: number, end: number }
export interface TimeAndValue<T> extends TimeAnd { value: T }
export interface TimeAndMelody extends TimeAnd { note: number }
export interface TimeAndChord extends TimeAnd { chord: Chord }
export interface TimeAndRomanAnalysis extends TimeAnd {
  scale: string,
  chord: string,
  roman: string,
}
export interface TimeAndMelodyAnalysis extends TimeAnd {
  note: number,
  roman_name: string,
  melody_analysis: MelodyAnalysis,
}
