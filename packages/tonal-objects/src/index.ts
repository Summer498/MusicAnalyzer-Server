import { assertNonNullable as NN, castToNumber } from "@music-analyzer/stdlib";
import { NoteLiteral } from "tonal";
import { default as Interval } from "@tonaljs/interval";
import { default as Note } from "@tonaljs/note";

export type Note = ReturnType<typeof Note.get>
export type Interval = ReturnType<typeof Interval.get>
export type ChordName = string;
export type ScaleName = string;
export const getIntervalDegree = (src: NoteLiteral, dst: NoteLiteral) => castToNumber(Interval.distance(src, dst).slice(0, 1));
export const getChroma = (note: NoteLiteral | null) => NN(Note.chroma(NN(note)));