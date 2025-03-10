import { assertNonNullable as NN, castToNumber } from "@music-analyzer/stdlib";
import { NoteLiteral as _NoteLiteral } from "tonal";
import { default as _Interval } from "@tonaljs/interval";
import { default as _Note } from "@tonaljs/note";

export type Note = ReturnType<typeof _Note.get>
export type Interval = ReturnType<typeof _Interval.get>
export type ChordName = string;
export type ScaleName = string;
export const getIntervalDegree = (src: _NoteLiteral, dst: _NoteLiteral) => castToNumber(_Interval.distance(src, dst).slice(0, 1));
export const getChroma = (note: _NoteLiteral | null) => NN(_Note.chroma(NN(note)));