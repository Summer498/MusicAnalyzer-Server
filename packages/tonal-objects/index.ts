import { assertNonNullable as NN, castToNumber } from "@music-analyzer/stdlib";
import { NoteLiteral as _NoteLiteral } from "tonal";
import { default as _Interval } from "@tonaljs/interval";
import { default as _Note } from "@tonaljs/note";
import { default as __Chord } from "@tonaljs/chord";
import { default as __Scale } from "@tonaljs/scale";


export { type Chord } from '@tonaljs/chord';
export { type Scale } from '@tonaljs/scale';
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