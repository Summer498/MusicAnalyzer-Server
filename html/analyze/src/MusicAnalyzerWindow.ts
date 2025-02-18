import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { GroupingStructure, IProlongationalReduction, ITimeSpanReduction, MetricalStructure, MusicXML } from "@music-analyzer/gttm";

export type MusicAnalyzer = {
  readonly roman: TimeAndRomanAnalysis[],
  readonly hierarchical_melody: IMelodyModel[][],
  readonly melody: IMelodyModel[],
  readonly musicxml?: MusicXML,
  readonly GTTM: {
    readonly grouping?: GroupingStructure,
    readonly metric?: MetricalStructure,
    readonly time_span?: ITimeSpanReduction,
    readonly prolongation?: IProlongationalReduction,
  }
}

export interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: MusicAnalyzer
}
