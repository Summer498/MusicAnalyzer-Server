export class TimeAndRomanAnalysis {
  constructor(
    readonly begin: number,
    readonly end: number,
    readonly chord: string,
    readonly scale: string,
    readonly roman: string,
  ) { }
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
  static instantiate(e: RomanAnalysisData) {
    return new RomanAnalysisData(e.body.map(e => new TimeAndRomanAnalysis(e.begin, e.end, e.chord, e.scale, e.roman)))
  }
}

