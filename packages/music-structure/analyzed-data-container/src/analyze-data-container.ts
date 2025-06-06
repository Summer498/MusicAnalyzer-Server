import { BeatInfo, calcTempo } from "@music-analyzer/beat-estimation";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export interface AnalyzedDataContainer {
  readonly roman: SerializedTimeAndRomanAnalysis[]
  readonly melody: SerializedTimeAndAnalyzedMelody[]
  readonly hierarchical_melody: SerializedTimeAndAnalyzedMelody[][]
  readonly beat_info: BeatInfo
  readonly d_melodies: SerializedTimeAndAnalyzedMelody[]
}

export const createAnalyzedDataContainer = (
  roman: SerializedTimeAndRomanAnalysis[],
  melody: SerializedTimeAndAnalyzedMelody[],
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
): AnalyzedDataContainer => {
  const d_melodies = melody.map(e => e);
  const filtered = d_melodies.map(e => e)
    .filter((e, i) => i + 1 >= d_melodies.length ||
      60 / (d_melodies[i + 1].time.begin - d_melodies[i].time.begin) < 300 * 4);
  return {
    roman,
    melody: filtered,
    hierarchical_melody,
    beat_info: calcTempo(filtered, roman),
    d_melodies,
  };
};
