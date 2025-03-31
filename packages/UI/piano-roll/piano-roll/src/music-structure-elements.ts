import { BeatInfo } from "./facade";
import { TimeAndRomanAnalysis } from "./facade";
import { TimeAndAnalyzedMelody } from "./facade";
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