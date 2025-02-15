import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/gttm";
import { GRP, MTR, D_TSR, D_PRR } from "@music-analyzer/gttm";

export type MusicAnalyzer = {
  readonly roman: TimeAndRomanAnalysis[],
  readonly hierarchical_melody: IMelodyModel[][],
  readonly melody: IMelodyModel[],
  readonly musicxml?: MusicXML,
  readonly GTTM: {
    readonly grouping?: GRP,
    readonly metric?: MTR,
    readonly time_span?: D_TSR,
    readonly prolongation?: D_PRR,
  }
}

export interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: MusicAnalyzer
}
