import { TimeAndRomanAnalysis } from "./facade";
import { GroupingStructure } from "./facade";
import { IProlongationalReduction } from "./facade";
import { ITimeSpanReduction } from "./facade";
import { MetricalStructure } from "./facade";
import { TimeAndAnalyzedMelody } from "./facade";
import { MusicXML } from "./facade";

export type DataPromises = [
  Promise<TimeAndRomanAnalysis[]>,
  Promise<TimeAndAnalyzedMelody[]>,
  Promise<MusicXML | undefined>,
  Promise<GroupingStructure | undefined>,
  Promise<MetricalStructure | undefined>,
  Promise<ITimeSpanReduction | undefined>,
  Promise<IProlongationalReduction | undefined>,
];
