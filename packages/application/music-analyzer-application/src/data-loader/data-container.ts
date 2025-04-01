import { GroupingStructure } from "./facade";
import { MetricalStructure } from "./facade";
import { IProlongationalReduction } from "./facade";
import { ITimeSpanReduction } from "./facade";
import { SerializedTimeAndRomanAnalysis } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { MusicXML } from "./facade";

export type DataContainer = [
  SerializedTimeAndRomanAnalysis[],
  SerializedTimeAndAnalyzedMelody[],
  MusicXML | undefined,
  GroupingStructure | undefined,
  MetricalStructure | undefined,
  ITimeSpanReduction | undefined,
  IProlongationalReduction | undefined,
]