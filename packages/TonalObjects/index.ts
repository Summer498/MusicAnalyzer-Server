import { assertNonNullable as NN, castToNumber } from "../StdLib";
import { NoteLiteral as _NoteLiteral } from "tonal";
import _Interval from "@tonaljs/interval";
import _Note from "@tonaljs/note";
import __Chord from "@tonaljs/chord";
import __Scale from "@tonaljs/scale";


export { Chord } from '@tonaljs/chord';
export { Scale } from '@tonaljs/scale';
export const _Chord = __Chord;
export const _Scale = __Scale;
export { default as _RomanNumeral } from "@tonaljs/roman-numeral";
export { default as _Note } from "@tonaljs/note";
export { default as _Interval } from "@tonaljs/interval";
export { default as _Key } from "@tonaljs/key";
export { ChordDictionary as _ChordDictionary } from "tonal";

export type Note = ReturnType<typeof _Note.get>
export type Interval = ReturnType<typeof _Interval.get>
export type ChordName = string;
export type ScaleName = string;
export type NoteLiteral = _NoteLiteral;
export const getIntervalDegree = (src: _NoteLiteral, dst: _NoteLiteral) => castToNumber(_Interval.distance(src, dst).slice(0, 1));
export const getChroma = (note: _NoteLiteral | null) => NN(_Note.chroma(NN(note)));