import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { GTTMData } from "@music-analyzer/gttm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export class AnalyzedMusicData {
  constructor(
    readonly roman: SerializedTimeAndRomanAnalysis[],
    readonly melody: SerializedTimeAndAnalyzedMelody[],
    readonly hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
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
