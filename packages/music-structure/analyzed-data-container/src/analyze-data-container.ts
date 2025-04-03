import { BeatInfo } from "@music-analyzer/beat-estimation";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { bracket_height } from "@music-analyzer/view-parameters";
import { PianoRollBegin } from "@music-analyzer/view-parameters";
import { PianoRollEnd } from "@music-analyzer/view-parameters";

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

    // SVG -->
    const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
    const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
    [hierarchical_melody.length]
      .map(e => e * bracket_height)
      .map(e => e / 12)
      .map(e => Math.floor(e))
      .map(e => e * 12)
      .map(e => e + highest_pitch)
      .map(e => e + 12)
      .map(e => PianoRollBegin.set(e))

      PianoRollEnd.set(lowest_pitch - 3);
  }
}