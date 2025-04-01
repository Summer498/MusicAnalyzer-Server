import { Time } from "./facade";
import { MelodyAnalysis } from "./melody-analysis";

type SerializedTimeAndAnalyzedMelody_Args = [Time, Time, number, MelodyAnalysis]
const getArgsOfSerializedTimeAndAnalyzedMelody = (
  args
    : SerializedTimeAndAnalyzedMelody_Args
    | [SerializedTimeAndAnalyzedMelody]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [new Time(e.time), new Time(e.head), e.note, new MelodyAnalysis(e.melody_analysis)] as SerializedTimeAndAnalyzedMelody_Args
  }
  return args
}
export class SerializedTimeAndAnalyzedMelody {
  readonly time: Time
  readonly head: Time
  readonly note: number
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: SerializedTimeAndAnalyzedMelody);
  constructor(
    time: Time,
    head: Time,
    note: number,
    melody_analysis: MelodyAnalysis,
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
