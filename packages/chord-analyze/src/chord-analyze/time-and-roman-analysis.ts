import { Time } from "@music-analyzer/time-and";

type TimeAndRomanAnalysis_Arg = [Time, string, string, string];
const getArgsOfTimeAndRomanAnalysis = (
  args
    : TimeAndRomanAnalysis_Arg
    | [TimeAndRomanAnalysis]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.time, e.chord, e.scale, e.roman] as TimeAndRomanAnalysis_Arg
  }
  return args;
}

export class TimeAndRomanAnalysis {
  readonly time: Time;
  readonly chord: string
  readonly scale: string
  readonly roman: string
  constructor(e: TimeAndRomanAnalysis);
  constructor(
    time: Time,
    chord: string,
    scale: string,
    roman: string,
  );
  constructor(
    ...args
      : TimeAndRomanAnalysis_Arg
      | [TimeAndRomanAnalysis]
  ) {
    const [time, chord, scale, roman] = getArgsOfTimeAndRomanAnalysis(args);
    this.time = new Time(time);
    this.chord = chord;
    this.scale = scale;
    this.roman = roman;
  }
}

const v = "25.03.07.10.50";
export class RomanAnalysisData {
  readonly version = v;
  constructor(
    readonly body: TimeAndRomanAnalysis[]
  ) { }
  static checkVersion(e: RomanAnalysisData) {
    return e.version === v;
  }
  // required by the class with the constructor which has 1 argument
  static instantiate(e: RomanAnalysisData) {
    return new RomanAnalysisData(e.body.map(e => new TimeAndRomanAnalysis(e)))
  }
}

