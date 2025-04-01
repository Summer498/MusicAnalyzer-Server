import { SerializedTimeAndRomanAnalysis } from "./facade";
import { GroupingStructure } from "./facade";
import { IProlongationalReduction } from "./facade";
import { ITimeSpanReduction } from "./facade";
import { MetricalStructure } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { MusicXML } from "./facade";

export type DataPromises = [
  Promise<SerializedTimeAndRomanAnalysis[]>,
  Promise<SerializedTimeAndAnalyzedMelody[]>,
  Promise<MusicXML | undefined>,
  Promise<GroupingStructure | undefined>,
  Promise<MetricalStructure | undefined>,
  Promise<ITimeSpanReduction | undefined>,
  Promise<IProlongationalReduction | undefined>,
];
