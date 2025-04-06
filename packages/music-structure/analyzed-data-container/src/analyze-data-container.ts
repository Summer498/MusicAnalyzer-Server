import { BeatInfo } from "@music-analyzer/beat-estimation";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export class AnalyzedDataContainer {
  readonly beat_info: BeatInfo
  readonly d_melodies: SerializedTimeAndAnalyzedMelody[]
  constructor(
    readonly roman: SerializedTimeAndRomanAnalysis[],
    readonly melody: SerializedTimeAndAnalyzedMelody[],
    readonly hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
  ) {
    this.d_melodies = melody.map(e => e);
    this.melody = this.d_melodies.map(e => e)
      .filter((e, i) => i + 1 >= this.d_melodies.length || 60 / (this.d_melodies[i + 1].time.begin - this.d_melodies[i].time.begin) < 300 * 4);

    // テンポの計算
    this.beat_info = calcTempo(this.melody, this.roman);
  }
}