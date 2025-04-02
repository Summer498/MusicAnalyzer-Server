import { SerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";


const v = "25.03.10.08.51";
export class SerializedMelodyAnalysisData {
  readonly version = v;
  constructor(
    readonly body: SerializedTimeAndAnalyzedMelody[]
  ) { }
  static checkVersion(e: SerializedMelodyAnalysisData) {
    return e.version === v;
  }
  static instantiate(e: SerializedMelodyAnalysisData) {
    return new SerializedMelodyAnalysisData(e.body.map(e => new SerializedTimeAndAnalyzedMelody(e)))
  }
}