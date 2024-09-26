import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/gttm/src/MusicXML";
import { GRP, MTR, D_TSR, PR } from "@music-analyzer/gttm";

export interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: {
    roman: TimeAndRomanAnalysis[],
    hierarchical_melody: TimeAndMelodyAnalysis[][],
    melody: TimeAndMelodyAnalysis[],
    musicxml: MusicXML,
    GTTM: {
      grouping: GRP,
      metric: MTR,
      time_span: D_TSR,
      prolongation: PR,
    }
  }
}
