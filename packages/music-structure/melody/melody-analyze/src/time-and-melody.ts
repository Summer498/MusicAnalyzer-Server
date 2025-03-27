import { Time } from "@music-analyzer/time-and/src/time";

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