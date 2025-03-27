import { Time } from "@music-analyzer/time-and/src/time";
import { MelodyAnalysis } from "./melody-analysis";

type TimeAndAnalyzedMelody_Args = [Time, Time, number, MelodyAnalysis]
const getArgsOfTimeAndAnalyzedMelody = (
  args
    : TimeAndAnalyzedMelody_Args
    | [TimeAndAnalyzedMelody]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [new Time(e.time), new Time(e.head), e.note, new MelodyAnalysis(e.melody_analysis)] as TimeAndAnalyzedMelody_Args
  }
  return args
}
export class TimeAndAnalyzedMelody {
  readonly time: Time
  readonly head: Time
  readonly note: number
  readonly melody_analysis: MelodyAnalysis;
  constructor(e: TimeAndAnalyzedMelody);
  constructor(
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
    const [time, head, note, melody_analysis] = getArgsOfTimeAndAnalyzedMelody(args);
    this.time = time
    this.head = head
    this.note = note
    this.melody_analysis = melody_analysis
  }

}
