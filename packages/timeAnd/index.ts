import { Chord, Scale } from "../TonalObjects";
import { MelodyAnalysis } from "../melodyAnalyze";

/*
import { RomanChord } from "../KeyEstimation";
type ObsoleteTimeAnd = { time: number[] }
interface ObsoleteTimeAndValue<T> extends ObsoleteTimeAnd { value: T }
interface ObsoleteTimeAndMelody extends ObsoleteTimeAnd { note: number }
interface ObsoleteTimeAndChord extends ObsoleteTimeAnd { chord: Chord }
interface ObsoleteTimeAndRoman extends ObsoleteTimeAnd { progression: RomanChord }
interface ObsoleteTimeAndMelodyAnalysis extends ObsoleteTimeAnd {
  note: number;
  roman_name: string | undefined;
  melody_analysis: MelodyAnalysis;
};
*/


export type TimeAnd = { begin: number, end: number }
export interface TimeAndValue<T> extends TimeAnd { value: T }
export interface TimeAndMelody extends TimeAnd { note: number }
export interface TimeAndChord extends TimeAnd { chord: Chord }
export interface TimeAndRomanAnalysis extends TimeAnd {
  scale: Scale,
  chord: Chord,
  roman: string,
}
export interface TimeAndMelodyAnalysis extends TimeAnd {
  note: number,
  roman_name: string,
  melody_analysis: MelodyAnalysis,
}
