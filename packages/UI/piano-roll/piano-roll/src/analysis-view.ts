import { BeatInfo } from "@music-analyzer/beat-estimation";
import { BeatElements } from "@music-analyzer/beat-view";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordElements } from "@music-analyzer/chord-view";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MelodyElements, createMelodyElements } from "@music-analyzer/melody-view";
import { RequiredByBeatElements } from "@music-analyzer/beat-view";
import { RequiredByChordElements } from "@music-analyzer/chord-view";
import { RequiredByMelodyElements } from "@music-analyzer/melody-view";

export interface MusicStructureElements {
  readonly beat: BeatElements
  readonly chord: ChordElements
  readonly melody: MelodyElements
}

export function createMusicStructureElements(
  beat_info: BeatInfo,
  romans: SerializedTimeAndRomanAnalysis[],
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
  melodies: SerializedTimeAndAnalyzedMelody[],
  d_melodies: SerializedTimeAndAnalyzedMelody[],
  controllers: RequiredByBeatElements & RequiredByChordElements & RequiredByMelodyElements,
): MusicStructureElements {
  const beat = new BeatElements(beat_info, melodies, controllers)
  const chord = new ChordElements(romans, controllers)
  const melody = createMelodyElements(hierarchical_melody, d_melodies, controllers)
  return { beat, chord, melody }
}

export interface AnalysisView {
  readonly svg: SVGGElement
}

export function createAnalysisView(
  analysis: MusicStructureElements,
): AnalysisView {
  const { beat, chord, melody } = analysis
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g")
  // svg.appendChild(beat.beat_bars)
  svg.appendChild(chord.chord_notes)
  svg.appendChild(chord.chord_names)
  svg.appendChild(chord.chord_romans)
  svg.appendChild(chord.chord_keys)
  svg.appendChild(melody.d_melody_collection)
  svg.appendChild(melody.melody_hierarchy)
  svg.appendChild(melody.ir_hierarchy)
  svg.appendChild(melody.ir_gravity)
  svg.appendChild(melody.chord_gravities)
  svg.appendChild(melody.scale_gravities)
  svg.appendChild(melody.time_span_tree)
  return { svg }
}