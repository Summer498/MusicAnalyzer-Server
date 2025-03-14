import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { bracket_height, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";
import { AnalyzedDataContainer } from "./analyzed-data-container";
import { AnalyzedMusicData } from "./MusicAnalyzerWindow";

export const initializeApplication = (
  analyzed: AnalyzedMusicData,
) => { new AnalyzedDataContainer(analyzed) };
