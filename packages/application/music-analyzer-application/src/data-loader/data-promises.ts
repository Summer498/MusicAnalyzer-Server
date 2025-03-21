import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { GroupingStructure, IProlongationalReduction, ITimeSpanReduction, MetricalStructure } from "@music-analyzer/gttm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/musicxml";

export type DataPromises = [
  Promise<TimeAndRomanAnalysis[]>,
  Promise<TimeAndAnalyzedMelody[]>,
  Promise<MusicXML | undefined>,
  Promise<GroupingStructure | undefined>,
  Promise<MetricalStructure | undefined>,
  Promise<ITimeSpanReduction | undefined>,
  Promise<IProlongationalReduction | undefined>,
];
