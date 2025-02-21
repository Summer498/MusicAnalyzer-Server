import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export class AnalyzedDataContainer {
  readonly beat_info: BeatInfo;
  readonly romans: TimeAndRomanAnalysis[];
  readonly hierarchical_melody: TimeAndAnalyzedMelody[][];
  readonly melodies: TimeAndAnalyzedMelody[];
  readonly d_melodies: TimeAndAnalyzedMelody[];
  constructor(
    beat_info: BeatInfo,
    romans: TimeAndRomanAnalysis[],
    hierarchical_melody: TimeAndAnalyzedMelody[][],
    melodies: TimeAndAnalyzedMelody[],
    d_melodies: TimeAndAnalyzedMelody[],
  ) {
    this.beat_info = beat_info;
    this.romans = romans;
    this.hierarchical_melody = hierarchical_melody;
    this.melodies = melodies;
    this.d_melodies = d_melodies;
  }
}