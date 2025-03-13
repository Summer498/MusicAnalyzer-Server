import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export class AnalyzedDataContainer {
  constructor(
    readonly beat_info: BeatInfo,
    readonly romans: TimeAndRomanAnalysis[],
    readonly hierarchical_melody: TimeAndAnalyzedMelody[][],
    readonly melodies: TimeAndAnalyzedMelody[],
    readonly d_melodies: TimeAndAnalyzedMelody[],
  ) {  }
}