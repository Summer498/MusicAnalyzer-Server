import { Archetype } from "@music-analyzer/irm";
import { Chord } from "@music-analyzer/tonal-objects";

export type Gravity = {
  readonly destination?: number;
  readonly resolved?: true
}
export type MelodyAnalysis = {
  readonly scale_gravity?: Gravity,
  readonly chord_gravity?: Gravity,
  readonly implication_realization: Archetype,
};
export interface TimeAndMelody {
  readonly begin: number,
  readonly end: number,
  readonly note: number,
  readonly head: {
    readonly begin: number,
    readonly end: number,
  }
}
export interface ITimeAndChord {
  readonly begin: number,
  readonly end: number,
  readonly chord: Chord
}
export interface IMelodyModel {
  readonly begin: number,
  readonly end: number,
  readonly note: number,
  readonly head: {
    readonly begin: number,
    readonly end: number,
  }
  readonly melody_analysis: MelodyAnalysis,
}
