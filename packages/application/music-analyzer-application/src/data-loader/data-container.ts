import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { GroupingStructure } from "@music-analyzer/gttm";
import { IProlongationalReduction } from "@music-analyzer/gttm";
import { ITimeSpanReduction } from "@music-analyzer/gttm";
import { MetricalStructure } from "@music-analyzer/gttm";
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