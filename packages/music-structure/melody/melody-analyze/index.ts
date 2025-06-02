import { Time } from "@music-analyzer/time-and";
import { compress } from "@music-analyzer/time-and";
import { Dyad } from "@music-analyzer/irm";
import { Monad } from "@music-analyzer/irm";
import { Null_ad } from "@music-analyzer/irm";
import { Triad } from "@music-analyzer/irm";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { getChord } from "@music-analyzer/tonal-objects";
import { noteFromMidi } from "@music-analyzer/tonal-objects";
import { getScale } from "@music-analyzer/tonal-objects";
import { mod } from "@music-analyzer/math";
import { Chord } from "@music-analyzer/tonal-objects";
import { getNote } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";
import { getTriad } from "@music-analyzer/irm";

// TODO: マイナーコードに対応する
export const registerGravity = (pitch_class_set: Scale | Chord | undefined, curr?: number, next?: number) => {
  if (!pitch_class_set) { return undefined; }
  const name = pitch_class_set.name;
  const tonic = getNote(pitch_class_set.tonic || "").chroma;
  if (curr === undefined) { return undefined; }
  const chroma = mod(curr - tonic - (name.includes("major") ? 0 : 3), 12);
  const destination = chroma === 11 ? curr + 1 : chroma === 5 ? curr - 1 : undefined;
  if (destination === undefined) { return undefined; }
  return new Gravity(
    destination,
    destination && next === destination || undefined
  );
};


const getSome_ad = (prev?: number, curr?: number, next?: number) => {
  const [p, c, n] = [prev, curr, next].map(e => e ? noteFromMidi(e) : undefined);
  if (c !== undefined) {
    if (p !== undefined) {
      if (n !== undefined) { return getTriad(p, c, n) }
      else { return new Dyad(p, c); }
    }
    else if (n !== undefined) { return new Dyad(c, n) }
    else { return new Monad(c) }
  }
  else if (p !== undefined) { return new Monad(p); }
  else if (n !== undefined) { return new Monad(n); }
  else { return new Null_ad(); }
}

export const analyzeMelody = (
  melodies: TimeAndMelody[],
  romans: SerializedTimeAndRomanAnalysis[],
) => {
  //  const prev_prev = [undefined, undefined, ...melodies];
  const prev = [undefined, ...melodies];
  const curr = [...melodies];
  const next = [...melodies.slice(1), undefined];
  return curr.map((e, i) => {
    const roman = romans.find(roman => roman.time.begin <= e.time.end && e.time.begin < roman.time.end); // TODO: 治す. 現状はとりあえずコードとメロディを大きめに重ならせてみているだけ
    const time_and_melody = new TimeAndMelody(
      e.time,
      e.head,
      e.note,
    );

    const melody_analysis = new SerializedMelodyAnalysis(
      registerGravity(roman && getScale(roman.scale), prev[i]?.note, curr[i]?.note),
      registerGravity(roman && getChord(roman.chord), prev[i]?.note, curr[i]?.note),
      getSome_ad(prev[i]?.note, curr[i]?.note, next[i]?.note)
    );

    return new SerializedTimeAndAnalyzedMelody(
      time_and_melody.time,
      time_and_melody.head,
      time_and_melody.note,
      melody_analysis,
    );
  }).filter(e => isNaN(0 * e.note) === false);
};

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

type MelodyAnalysis_Args = [Gravity | undefined, Gravity | undefined, Triad | Dyad | Monad | Null_ad];
const getArgsOfMelodyAnalysis = (
  args
    : MelodyAnalysis_Args
    | [SerializedMelodyAnalysis]
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

export class SerializedMelodyAnalysis {
  readonly chord_gravity: Gravity | undefined
  readonly scale_gravity: Gravity | undefined
  readonly implication_realization: Triad | Dyad | Monad | Null_ad
  constructor(e: SerializedMelodyAnalysis);
  constructor(
    scale_gravity: Gravity | undefined,
    chord_gravity: Gravity | undefined,
    implication_realization: Triad | Dyad | Monad | Null_ad,
  );
  constructor(
    ...args
      : MelodyAnalysis_Args
      | [SerializedMelodyAnalysis]
  ) {
    const [scale_gravity, chord_gravity, implication_realization] = getArgsOfMelodyAnalysis(args)
    this.scale_gravity = scale_gravity;
    this.chord_gravity = chord_gravity;
    this.implication_realization = implication_realization;
  }
};

const freqToMidi = (freq: number) => (Math.log2(freq) - Math.log2(440)) * 12 + 69;

export const getTimeAndMelody = (melody_data: number[], sampling_rate: number) => {
  const melody = melody_data.map(e => e || Math.round(freqToMidi(e)));
  const comp_melody = compress(melody);
  const non_null_melody = comp_melody.map(e => {
    const time = e.time.map(e => e / sampling_rate);
    return new TimeAndMelody(
      time,
      time,
      e.item,
    );
  }).filter(e => e.note);
  return non_null_melody;
};

const v = "25.03.10.08.51" as string;
export class SerializedMelodyAnalysisData {
  readonly version = v;
  constructor(
    readonly body: SerializedTimeAndAnalyzedMelody[]
  ) { }
  static checkVersion(e: {version:string}) {
    return e.version === v;
  }
  static instantiate(e: {body:SerializedTimeAndAnalyzedMelody[]}) {
    return new SerializedMelodyAnalysisData(e.body.map(e => new SerializedTimeAndAnalyzedMelody(e)))
  }
}

type SerializedTimeAndAnalyzedMelody_Args = [Time, Time, number, SerializedMelodyAnalysis]
const getArgsOfSerializedTimeAndAnalyzedMelody = (
  args
    : SerializedTimeAndAnalyzedMelody_Args
    | [SerializedTimeAndAnalyzedMelody]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [new Time(e.time), new Time(e.head), e.note, new SerializedMelodyAnalysis(e.melody_analysis)] as SerializedTimeAndAnalyzedMelody_Args
  }
  return args
}

export class SerializedTimeAndAnalyzedMelody {
  readonly time: Time
  readonly head: Time
  readonly note: number
  readonly melody_analysis: SerializedMelodyAnalysis;
  constructor(e: SerializedTimeAndAnalyzedMelody);
  constructor(
    time: Time,
    head: Time,
    note: number,
    melody_analysis: SerializedMelodyAnalysis,
  );
  constructor(
    ...args
      : SerializedTimeAndAnalyzedMelody_Args
      | [SerializedTimeAndAnalyzedMelody]
  ) {
    const [time, head, note, melody_analysis] = getArgsOfSerializedTimeAndAnalyzedMelody(args);
    this.time = time
    this.head = head
    this.note = note
    this.melody_analysis = melody_analysis
  }
}

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