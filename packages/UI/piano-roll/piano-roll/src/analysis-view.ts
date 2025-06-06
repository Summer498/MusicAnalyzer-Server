import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatElements, createBeatElements } from "@music-analyzer/beat-view";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordElements } from "@music-analyzer/chord-view";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyElements, createMelodyElements } from "@music-analyzer/melody-view";
import { RequiredByBeatElements } from "@music-analyzer/beat-view";
import { RequiredByChordElements } from "@music-analyzer/chord-view";
import { RequiredByMelodyElements } from "@music-analyzer/melody-view";

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
    this.beat = createBeatElements(beat_info, melodies, controllers)
    this.chord = new ChordElements(romans, controllers)
    this.melody = createMelodyElements(hierarchical_melody, d_melodies, controllers)
  }
}

export class AnalysisView {
  readonly svg: SVGGElement;
  constructor(
    analysis: MusicStructureElements,
  ) {
    const { beat, chord, melody } = analysis;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // this.svg.appendChild(beat.beat_bars);
    this.svg.appendChild(chord.chord_notes);
    this.svg.appendChild(chord.chord_names);
    this.svg.appendChild(chord.chord_romans);
    this.svg.appendChild(chord.chord_keys);
    this.svg.appendChild(melody.d_melody_collection);
    this.svg.appendChild(melody.melody_hierarchy);
    this.svg.appendChild(melody.ir_hierarchy);
    this.svg.appendChild(melody.ir_gravity);
    this.svg.appendChild(melody.chord_gravities);
    this.svg.appendChild(melody.scale_gravities);
    this.svg.appendChild(melody.time_span_tree);
  }
}