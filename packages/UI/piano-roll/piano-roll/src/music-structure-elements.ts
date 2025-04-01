import { BeatInfo } from "./facade";
import { SerializedTimeAndRomanAnalysis } from "./facade";
import { SerializedTimeAndAnalyzedMelody } from "./facade";
import { BeatElements } from "./facade";
import { ChordElements } from "./facade";
import { MelodyElements } from "./facade";
import { RequiredByBeatElements } from "./facade";
import { RequiredByChordElements } from "./facade";
import { RequiredByMelodyElements } from "./facade";

export class MusicStructureElements {
  readonly beat: BeatElements
  readonly chord: ChordElements
  readonly melody: MelodyElements
  constructor(
    beat_info: BeatInfo,
    romans: SerializedTimeAndRomanAnalysis[],
    hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
    melodies: SerializedTimeAndAnalyzedMelody[],
    d_melodies: SerializedTimeAndAnalyzedMelody[],
    controllers: RequiredByBeatElements & RequiredByChordElements & RequiredByMelodyElements
  ) {
    this.beat = new BeatElements(beat_info, melodies, controllers)
    this.chord = new ChordElements(romans, controllers)
    this.melody = new MelodyElements(hierarchical_melody, d_melodies, controllers)
  }
}