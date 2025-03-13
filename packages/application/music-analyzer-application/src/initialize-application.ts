import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { bracket_height, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";
import { AnalyzedDataContainer } from "./analyzed-data-container";
import { AnalyzedMusicData } from "./MusicAnalyzerWindow";

export const initializeApplication = (
  analyzed: AnalyzedMusicData,
) => {
  const d_romans: TimeAndRomanAnalysis[] = analyzed.roman.map(e => e);
  const d_melodies: TimeAndAnalyzedMelody[] = analyzed.melody.map(e => e);
  const romans = d_romans.map(e => e);
  const melodies = d_melodies.map(e => e)
    .filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].time.begin - d_melodies[i].time.begin) < 300 * 4);

  // テンポの計算
  const beat_info = calcTempo(melodies, romans);

  // SVG -->
  const highest_pitch = analyzed.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = analyzed.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
  PianoRollBegin.set(highest_pitch + Math.floor(analyzed.hierarchical_melody.length * bracket_height / 12) * 12 + 12);
  PianoRollEnd.set(lowest_pitch - 3);
  return new AnalyzedDataContainer(
    beat_info,
    romans,
    analyzed.hierarchical_melody,
    melodies,
    d_melodies,
  );
};
