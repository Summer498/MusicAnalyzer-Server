import { Archetype } from "@music-analyzer/irm";
import { Time } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";

type Gravity_Args = [number, true | undefined];
const getArgsOfGravity = (
  args
    : Gravity_Args
    | [Gravity]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.destination, e.resolved] as Gravity_Args;
  }
  return args;
}
export class Gravity {
  readonly destination: number
  readonly resolved: true | undefined
  constructor(e: Gravity);
  constructor(
    destination: number,
    resolved: true | undefined,
  );
  constructor(
    ...args
      : Gravity_Args
      | [Gravity]
  ) {
    const [destination, resolved] = getArgsOfGravity(args);
    this.destination = destination;
    this.resolved = resolved;
  }
}

type MelodyAnalysis_Args = [Gravity | undefined, Gravity | undefined, Archetype];
const getArgsOfMelodyAnalysis = (
  args
    : MelodyAnalysis_Args
    | [MelodyAnalysis]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [
      e.scale_gravity && new Gravity(e.scale_gravity),
      e.chord_gravity && new Gravity(e.chord_gravity),
      e.implication_realization
    ] as MelodyAnalysis_Args
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


type TimeAndMelody_Args = [Time, Time, number]
const getArgsOfTimeAndMelody = (
  args
    : TimeAndMelody_Args
    | [TimeAndMelody]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [
      new Time(e.time),
      new Time(e.head),
      e.note
    ] as TimeAndMelody_Args
  }
  return args
}
export class TimeAndMelody {
  readonly time: Time
  readonly head: Time
  readonly note: number
  constructor(e: TimeAndMelody);
  constructor(
    time: Time,
    head: Time,
    note: number,
  );
  constructor(
    ...args
      : TimeAndMelody_Args
      | [TimeAndMelody]
  ) {
    const [time, head, note] = getArgsOfTimeAndMelody(args);
    this.time = time;
    this.head = head;
    this.note = note;
  }
}
export class TimeAndChord {
  constructor(
    readonly time: Time,
    readonly chord: Chord
  ) { }
}
type TimeAndAnalyzedMelody_Args = [number, number, Time, Time, number, MelodyAnalysis]
const getArgsOfTimeAndAnalyzedMelody = (
  args
    : TimeAndAnalyzedMelody_Args
    | [TimeAndAnalyzedMelody]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.begin, e.end, new Time(e.time), new Time(e.head), e.note, new MelodyAnalysis(e.melody_analysis)] as TimeAndAnalyzedMelody_Args
  }
  return args
}
export class TimeAndAnalyzedMelody {
  readonly begin: number
  readonly end: number
  readonly time: Time
  readonly head: Time
  readonly note: number
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: TimeAndAnalyzedMelody);
  constructor(
    begin: number,
    end: number,
    time: Time,
    head: Time,
    note: number,
    melody_analysis: MelodyAnalysis,
  );
  constructor(
    ...args
      : TimeAndAnalyzedMelody_Args
      | [TimeAndAnalyzedMelody]
  ) {
    const [begin, end, time, head, note, melody_analysis] = getArgsOfTimeAndAnalyzedMelody(args);
    this.begin = begin
    this.end = end
    this.time = time
    this.head = head
    this.note = note
    this.melody_analysis = melody_analysis
  }

}

const v = "25.03.07.23.56";
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