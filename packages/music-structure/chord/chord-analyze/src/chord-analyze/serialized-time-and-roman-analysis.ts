import { Time, createTime } from "@music-analyzer/time-and";

type SerializedTimeAndRomanAnalysis_Arg = [Time, string, string, string];
const getArgsOfSerializedTimeAndRomanAnalysis = (
  args
    : SerializedTimeAndRomanAnalysis_Arg
    | [SerializedTimeAndRomanAnalysis]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.time, e.chord, e.scale, e.roman] as SerializedTimeAndRomanAnalysis_Arg
  }
  return args;
}

export class SerializedTimeAndRomanAnalysis {
  readonly time: Time;
  readonly chord: string
  readonly scale: string
  readonly roman: string
  constructor(e: SerializedTimeAndRomanAnalysis);
  constructor(
    time: Time,
    chord: string,
    scale: string,
    roman: string,
  );
  constructor(
    ...args
      : SerializedTimeAndRomanAnalysis_Arg
      | [SerializedTimeAndRomanAnalysis]
  ) {
    const [time, chord, scale, roman] = getArgsOfSerializedTimeAndRomanAnalysis(args);
    this.time = createTime(time);
    this.chord = chord;
    this.scale = scale;
    this.roman = roman;
  }
}

const v = "25.03.10.08.51" as string;
export class SerializedRomanAnalysisData {
  readonly version = v;
  constructor(
    readonly body: SerializedTimeAndRomanAnalysis[]
  ) { }
  static checkVersion(e: { version: string }) {
    return e.version === v;
  }
  // required by the class with the constructor which has 1 argument
  static instantiate(e: { body: SerializedTimeAndRomanAnalysis[] }) {
    return new SerializedRomanAnalysisData(e.body.map(e => new SerializedTimeAndRomanAnalysis(e)))
  }
}

