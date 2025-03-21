import { BeatInfo } from "@music-analyzer/beat-estimation";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BeatElements, RequiredByBeatElements } from "@music-analyzer/beat-view";
import { ChordElements, RequiredByChordElements } from "@music-analyzer/chord-view";
import { MelodyElements, RequiredByMelodyElements } from "@music-analyzer/melody-view";

export class MusicStructureElements {
  readonly beat: BeatElements
  readonly chord: ChordElements
  readonly melody: MelodyElements
  constructor(
    beat_info: BeatInfo,
    romans: TimeAndRomanAnalysis[],
    hierarchical_melody: TimeAndAnalyzedMelody[][],
    melodies: TimeAndAnalyzedMelody[],
    d_melodies: TimeAndAnalyzedMelody[],
    controllers: RequiredByBeatElements & RequiredByChordElements & RequiredByMelodyElements
  ) {
    this.beat = new BeatElements(beat_info, melodies, controllers)
    this.chord = new ChordElements(romans, controllers)
    this.melody = new MelodyElements(hierarchical_melody, d_melodies, controllers)
  }
}