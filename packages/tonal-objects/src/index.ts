import { assertNonNullable as NN } from "@music-analyzer/stdlib/src/assertion/not-null-like";
import { castToNumber } from "@music-analyzer/stdlib/src/string/cast-to-number";
import { NoteLiteral } from "@tonaljs/pitch-note";
import { default as _Interval } from "@tonaljs/interval";
import { default as _Note } from "@tonaljs/note";

export type Note = ReturnType<typeof _Note.get>
export type Interval = ReturnType<typeof _Interval.get>
export type ChordName = string;
export type ScaleName = string;
export const getIntervalDegree = (src: NoteLiteral, dst: NoteLiteral) => castToNumber(_Interval.distance(src, dst).slice(0, 1));
export const getChroma = (note: NoteLiteral | null) => NN(_Note.chroma(NN(note)));