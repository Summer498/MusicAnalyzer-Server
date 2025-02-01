import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/gttm/src/MusicXML";
import { GRP, MTR, D_TSR, D_PRR } from "@music-analyzer/gttm";

export interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: {
    readonly roman: TimeAndRomanAnalysis[],
    readonly hierarchical_melody: TimeAndMelodyAnalysis[][],
    readonly melody: TimeAndMelodyAnalysis[],
    readonly musicxml: MusicXML,
    readonly GTTM: {
      readonly grouping: GRP,
      readonly metric: MTR,
      readonly time_span: D_TSR,
      readonly prolongation: D_PRR,
    }
  }
}
