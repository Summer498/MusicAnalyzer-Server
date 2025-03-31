import { TimeAndRomanAnalysis } from "./facade";
import { TimeAndAnalyzedMelody } from "./facade";
import { BeatInfo } from "./facade";
import { calcTempo } from "./facade";
import { bracket_height } from "./facade";
import { PianoRollBegin } from "./facade";
import { PianoRollEnd } from "./facade";

export class AnalyzedDataContainer {
  readonly beat_info: BeatInfo
  readonly d_melodies: TimeAndAnalyzedMelody[]
  constructor(
    readonly roman: TimeAndRomanAnalysis[],
    readonly melody: TimeAndAnalyzedMelody[],
    readonly hierarchical_melody: TimeAndAnalyzedMelody[][],
  ) {
    this.d_melodies = melody.map(e => e);
    this.melody = this.d_melodies.map(e => e)
      .filter((e, i) => i + 1 >= this.d_melodies.length || 60 / (this.d_melodies[i + 1].time.begin - this.d_melodies[i].time.begin) < 300 * 4);

    // テンポの計算
    this.beat_info = calcTempo(this.melody, this.roman);

    // SVG -->
    const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
    const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
    PianoRollBegin.set(highest_pitch + Math.floor(hierarchical_melody.length * bracket_height / 12) * 12 + 12);
    PianoRollEnd.set(lowest_pitch - 3);
  }
}