import { BeatElements, ChordElements, MelodyElements } from "../piano-roll";

export const setupAnalysis = (
  beat: BeatElements,
  chord: ChordElements,
  melody: MelodyElements,
) => {
  const analysis_view: { readonly svg: SVGGElement } = {
    svg: document.createElementNS("http://www.w3.org/2000/svg", "g")
  };
  analysis_view.svg.appendChild(beat.beat_bars.svg);
  analysis_view.svg.appendChild(chord.chord_notes.svg);
  analysis_view.svg.appendChild(chord.chord_names.svg);
  analysis_view.svg.appendChild(chord.chord_romans.svg);
  analysis_view.svg.appendChild(chord.chord_keys.svg);
  analysis_view.svg.appendChild(melody.d_melody_collection.svg);
  analysis_view.svg.appendChild(melody.melody_hierarchy.svg);
  analysis_view.svg.appendChild(melody.ir_hierarchy.svg);
  analysis_view.svg.appendChild(melody.chord_gravities.svg);
  analysis_view.svg.appendChild(melody.scale_gravities.svg);
  analysis_view.svg.appendChild(melody.time_span_tree.svg);
  return analysis_view;
};
