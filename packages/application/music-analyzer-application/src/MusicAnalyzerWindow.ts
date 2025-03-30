import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { GTTMData } from "@music-analyzer/gttm";

export class AnalyzedMusicData {
  constructor(
    readonly roman: TimeAndRomanAnalysis[],
    readonly melody: TimeAndAnalyzedMelody[],
    readonly hierarchical_melody: TimeAndAnalyzedMelody[][],
    readonly GTTM: GTTMData,
  ) { }
}

export interface MusicAnalyzerWindow
  extends Window {
  MusicAnalyzer: AnalyzedMusicData
}

export const getMusicAnalyzerWindow = (window: Window, raw_analyzed_data: AnalyzedMusicData) => {
  const e = window as MusicAnalyzerWindow;
  e.MusicAnalyzer = raw_analyzed_data;
  return e;
}
