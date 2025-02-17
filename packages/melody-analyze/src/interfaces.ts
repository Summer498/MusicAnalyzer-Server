import { Archetype } from "@music-analyzer/irm";
import { TimeAnd } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";

export type Gravity = {
  destination?: number;
  resolved?: true
}
export type MelodyAnalysis = {
  readonly scale_gravity?: Gravity,
  readonly chord_gravity?: Gravity,
  readonly implication_realization: Archetype,
};
export interface TimeAndMelody extends TimeAnd {
  readonly note: number,
  readonly head: TimeAnd
}
export interface TimeAndChord extends TimeAnd {
  readonly chord: Chord
}
export interface IMelodyModel extends TimeAnd {
  readonly note: number,
  readonly head: TimeAnd,
  readonly melody_analysis: MelodyAnalysis,
}
