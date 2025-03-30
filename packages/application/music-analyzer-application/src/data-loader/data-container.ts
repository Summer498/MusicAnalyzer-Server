import { GroupingStructure } from "@music-analyzer/gttm";
import { MetricalStructure } from "@music-analyzer/gttm";
import { IProlongationalReduction } from "@music-analyzer/gttm";
import { ITimeSpanReduction } from "@music-analyzer/gttm";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
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