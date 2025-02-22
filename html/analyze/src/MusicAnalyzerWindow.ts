import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GroupingStructure, IProlongationalReduction, ITimeSpanReduction, MetricalStructure } from "@music-analyzer/gttm";
import { MusicXML } from "@music-analyzer/musicxml";

export type AnalyzedMusicData = {
  readonly roman: TimeAndRomanAnalysis[],
  readonly hierarchical_melody: TimeAndAnalyzedMelody[][],
  readonly melody: TimeAndAnalyzedMelody[],
  readonly musicxml?: MusicXML,
  readonly GTTM: {
    readonly grouping?: GroupingStructure,
    readonly metric?: MetricalStructure,
    readonly time_span?: ITimeSpanReduction,
    readonly prolongation?: IProlongationalReduction,
  }
}

export interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: AnalyzedMusicData
}
