import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GroupingStructure, IProlongationalReduction, ITimeSpanReduction, MetricalStructure } from "@music-analyzer/gttm";

export class GTTMData {
  constructor(
    readonly grouping?: GroupingStructure,
    readonly metric?: MetricalStructure,
    readonly time_span?: ITimeSpanReduction,
    readonly prolongation?: IProlongationalReduction,
  ) { }
}

export class AnalyzedMusicData {
  constructor(
    readonly roman: TimeAndRomanAnalysis[],
    readonly melody: TimeAndAnalyzedMelody[],
    readonly hierarchical_melody: TimeAndAnalyzedMelody[][],
    readonly GTTM: GTTMData,
  ) { }
}

export interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: AnalyzedMusicData
}
