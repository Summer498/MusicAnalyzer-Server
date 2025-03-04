import { Archetype } from "@music-analyzer/irm";
import { Chord } from "@music-analyzer/tonal-objects";

export class Gravity {
  constructor(
    readonly destination: number,
    readonly resolved: true | undefined,
  ) { }
}
export class MelodyAnalysis {
  constructor(
    readonly scale_gravity: Gravity | undefined,
    readonly chord_gravity: Gravity | undefined,
    readonly implication_realization: Archetype,
  ) { }
};
export class TimeAndMelody {
  constructor(
    readonly begin: number,
    readonly end: number,
    readonly note: number,
    readonly head: {
      readonly begin: number,
      readonly end: number,
    }
  ) { }
}
export class TimeAndChord {
  constructor(
    readonly begin: number,
    readonly end: number,
    readonly chord: Chord
  ) { }
}
export class TimeAndAnalyzedMelody extends TimeAndMelody {
  constructor(
    e: TimeAndMelody,
    readonly melody_analysis: MelodyAnalysis,
  ) {
    super(
      e.begin,
      e.end,
      e.note,
      e.head,
    );
  }
}
