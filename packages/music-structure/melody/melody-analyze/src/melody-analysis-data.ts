import { TimeAndAnalyzedMelody } from "./time-and-analyzed-melody";


const v = "25.03.10.08.51";
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