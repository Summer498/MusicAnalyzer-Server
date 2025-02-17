import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { loadMusicAnalysis } from "./MusicAnalysisLoader";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { bracket_hight, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";
import { setupUI } from "@music-analyzer/piano-roll";
import { MusicAnalyzerWindow } from "./MusicAnalyzerWindow";

type Mode = "TSR" | "PR" | "";

export const initializeApplication = async (
  tune_id: string,
  mode: Mode,
  window: MusicAnalyzerWindow,
  place: HTMLDivElement,
  audio_element: HTMLAudioElement | HTMLVideoElement
) => {
  window.MusicAnalyzer = await loadMusicAnalysis(tune_id, mode);

  const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
  const d_melodies: IMelodyModel[] = window.MusicAnalyzer.melody.map(e => ({
    ...e,
    begin: e.begin,  // ズレ補正
    end: e.end,
  }));
  const romans = d_romans.map(e => e);
  const melodies = d_melodies.map(e => e)
    .filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].begin - d_melodies[i].begin) < 300 * 4);

  // テンポの計算
  const beat_info = calcTempo(melodies, romans);

  // SVG -->
  const highest_pitch = window.MusicAnalyzer.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = window.MusicAnalyzer.melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
  PianoRollBegin.value = highest_pitch + Math.floor(window.MusicAnalyzer.hierarchical_melody.length * bracket_hight / 12) * 12 + 12;
  PianoRollEnd.value = lowest_pitch - 3;
  setupUI(
    beat_info,
    romans,
    window.MusicAnalyzer.hierarchical_melody,
    d_melodies,
    place,
    audio_element
  );
};
