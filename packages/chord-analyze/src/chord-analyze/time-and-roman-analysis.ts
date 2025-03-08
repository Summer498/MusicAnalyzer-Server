type TimeAndRomanAnalysis_Arg = [number, number, string, string, string];
const getArgsOfTimeAndRomanAnalysis = (
  args
    : TimeAndRomanAnalysis_Arg
    | [TimeAndRomanAnalysis]
) => {
  if (args.length === 1) {
    const [e] = args;
    return [e.begin, e.end, e.chord, e.scale, e.roman] as TimeAndRomanAnalysis_Arg
  }
  return args;
}

export class TimeAndRomanAnalysis {
  readonly begin: number
  readonly end: number
  readonly chord: string
  readonly scale: string
  readonly roman: string
  constructor(e: TimeAndRomanAnalysis);
  constructor(
    begin: number,
    end: number,
    chord: string,
    scale: string,
    roman: string,
  );
  constructor(
    ...args
      : TimeAndRomanAnalysis_Arg
      | [TimeAndRomanAnalysis]
  ) {
    const [begin, end, chord, scale, roman] = getArgsOfTimeAndRomanAnalysis(args);
    this.begin = begin
    this.end = end;
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

