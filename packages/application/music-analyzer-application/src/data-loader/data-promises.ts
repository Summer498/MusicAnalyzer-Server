import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { GroupingStructure } from "@music-analyzer/gttm/src/analysis-result/GRP/grouping-structure";
import { IProlongationalReduction } from "@music-analyzer/gttm/src/analysis-result/PR/interface/i-prolongation-reduction";
import { ITimeSpanReduction } from "@music-analyzer/gttm/src/analysis-result/TSR/interface/i-time-span-reduction";
import { MetricalStructure } from "@music-analyzer/gttm/src/analysis-result/MTR/metric-structure";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
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
