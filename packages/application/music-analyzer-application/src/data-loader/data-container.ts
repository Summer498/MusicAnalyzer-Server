import { GroupingStructure } from "@music-analyzer/gttm/src/analysis-result/GRP/grouping-structure";
import { MetricalStructure } from "@music-analyzer/gttm/src/analysis-result/MTR/metric-structure";
import { IProlongationalReduction } from "@music-analyzer/gttm/src/analysis-result/PR/interface/i-prolongation-reduction";
import { ITimeSpanReduction } from "@music-analyzer/gttm/src/analysis-result/TSR/interface/i-time-span-reduction";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { MusicXML } from "@music-analyzer/musicxml";

export type DataContainer = [
  TimeAndRomanAnalysis[],
  TimeAndAnalyzedMelody[],
  MusicXML | undefined,
  GroupingStructure | undefined,
  MetricalStructure | undefined,
  ITimeSpanReduction | undefined,
  IProlongationalReduction | undefined,
]