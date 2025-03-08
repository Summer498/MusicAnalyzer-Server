import { Archetype } from "@music-analyzer/irm";
import { Chord } from "@music-analyzer/tonal-objects";

export class Gravity {
  constructor(
    readonly destination: number,
    readonly resolved: true | undefined,
  ) { }
}

type MelodyAnalysis_Args = [Gravity | undefined, Gravity | undefined, Archetype];
const getArgsOfMelodyAnalysis = (
  args
    : MelodyAnalysis_Args
    | [MelodyAnalysis]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.scale_gravity, e.chord_gravity, e.implication_realization] as MelodyAnalysis_Args
  }
  return args;
}
export class MelodyAnalysis {
  readonly chord_gravity: Gravity | undefined
  readonly scale_gravity: Gravity | undefined
  readonly implication_realization: Archetype
  constructor(e: MelodyAnalysis);
  constructor(
    scale_gravity: Gravity | undefined,
    chord_gravity: Gravity | undefined,
    implication_realization: Archetype,
  );
  constructor(
    ...args
      : MelodyAnalysis_Args
      | [MelodyAnalysis]
  ) {
    const [scale_gravity, chord_gravity, implication_realization] = getArgsOfMelodyAnalysis(args)
    this.scale_gravity = scale_gravity;
    this.chord_gravity = chord_gravity;
    this.implication_realization = implication_realization;
  }
};


type TimeAndMelody_Args = [number, number, number, { readonly begin: number, readonly end: number }]
const getArgsOfTimeAndMelody = (
  args
    : TimeAndMelody_Args
    | [TimeAndMelody]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.begin, e.end, e.note, e.head] as TimeAndMelody_Args
  }
  return args
}
export class TimeAndMelody {
  readonly begin: number
  readonly end: number
  readonly note: number
  readonly head: {
    readonly begin: number
    readonly end: number
  }
  constructor(e: TimeAndMelody);
  constructor(
    begin: number,
    end: number,
    note: number,
    head: {
      readonly begin: number,
      readonly end: number,
    }
  );
  constructor(
    ...args
      : TimeAndMelody_Args
      | [TimeAndMelody]
  ) {
    const [begin, end, note, head] = getArgsOfTimeAndMelody(args);
    this.begin = begin;
    this.end = end;
    this.note = note;
    this.head = head;
  }
}
export class TimeAndChord {
  constructor(
    readonly begin: number,
    readonly end: number,
    readonly chord: Chord
  ) { }
}
type TimeAndAnalyzedMelody_Args = [TimeAndMelody, MelodyAnalysis]
const getArgsOfTimeAndAnalyzedMelody = (
  args
    : TimeAndAnalyzedMelody_Args
    | [TimeAndAnalyzedMelody]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [new TimeAndMelody(e), new MelodyAnalysis(e.melody_analysis)] as TimeAndAnalyzedMelody_Args
  }
  return args
}
export class TimeAndAnalyzedMelody extends TimeAndMelody {
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: TimeAndAnalyzedMelody);
  constructor(
    e: TimeAndMelody,
    melody_analysis: MelodyAnalysis,
  );
  constructor(
    ...args
      : TimeAndAnalyzedMelody_Args
      | [TimeAndAnalyzedMelody]
  ) {
    const [e, melody_analysis] = getArgsOfTimeAndAnalyzedMelody(args);
    super(
      e.begin,
      e.end,
      e.note,
      e.head,
    );
    this.melody_analysis = melody_analysis
  }

}

const v = "25.03.07.10.55";
export class MelodyAnalysisData {
  readonly version = v;
  constructor(
    readonly body: TimeAndAnalyzedMelody[]
  ) { }
  static checkVersion(e: MelodyAnalysisData) {
    return e.version === v;
  }
  static instantiate(e: MelodyAnalysisData) {
    return new MelodyAnalysisData(e.body.map(e => new TimeAndAnalyzedMelody(e)))
  }
}