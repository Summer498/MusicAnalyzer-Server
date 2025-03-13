import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { GroupingStructure, IProlongationalReduction, ITimeSpanReduction, MetricalStructure } from "@music-analyzer/gttm";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
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