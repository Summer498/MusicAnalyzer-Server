import { GroupingStructure } from "./facade";
import { MetricalStructure } from "./facade";
import { IProlongationalReduction } from "./facade";
import { ITimeSpanReduction } from "./facade";
import { TimeAndRomanAnalysis } from "./facade";
import { TimeAndAnalyzedMelody } from "./facade";
import { MusicXML } from "./facade";

export type DataContainer = [
  TimeAndRomanAnalysis[],
  TimeAndAnalyzedMelody[],
  MusicXML | undefined,
  GroupingStructure | undefined,
  MetricalStructure | undefined,
  ITimeSpanReduction | undefined,
  IProlongationalReduction | undefined,
]