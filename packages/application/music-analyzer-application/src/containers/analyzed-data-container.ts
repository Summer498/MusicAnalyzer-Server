import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AnalyzedMusicData } from "../MusicAnalyzerWindow";
import { BeatInfo, calcTempo } from "@music-analyzer/beat-estimation";
import { bracket_height, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";

export class AnalyzedDataContainer {
  readonly beat_info: BeatInfo
  readonly romans: TimeAndRomanAnalysis[]
  readonly hierarchical_melody: TimeAndAnalyzedMelody[][]
  readonly melodies: TimeAndAnalyzedMelody[]
  readonly d_melodies: TimeAndAnalyzedMelody[]
  constructor(
    analyzed: AnalyzedMusicData,
  ) {
    const d_romans: TimeAndRomanAnalysis[] = analyzed.roman.map(e => e);
    this.d_melodies = analyzed.melody.map(e => e);
    this.romans = d_romans.map(e => e);
    this.melodies = this.d_melodies.map(e => e)
      .filter((e, i) => i + 1 >= this.d_melodies.length || 60 / (this.d_melodies[i + 1].time.begin - this.d_melodies[i].time.begin) < 300 * 4);

    // テンポの計算
    this.beat_info = calcTempo(this.melodies, this.romans);

    // SVG -->
    const highest_pitch = analyzed.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
    const lowest_pitch = analyzed.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
    PianoRollBegin.set(highest_pitch + Math.floor(analyzed.hierarchical_melody.length * bracket_height / 12) * 12 + 12);
    PianoRollEnd.set(lowest_pitch - 3);
    this.hierarchical_melody = analyzed.hierarchical_melody
  }
}