import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatElements } from "@music-analyzer/beat-view";
import { RequiredByBeatElements } from "@music-analyzer/beat-view/src/beat-elements";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordElements } from "@music-analyzer/chord-view";
import { RequiredByChordElements } from "@music-analyzer/chord-view/src/chord-elements";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyElements } from "@music-analyzer/melody-view";
import { RequiredByMelodyElements } from "@music-analyzer/melody-view/src/melody-elements";

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