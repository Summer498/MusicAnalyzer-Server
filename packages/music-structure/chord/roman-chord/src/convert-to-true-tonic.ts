import { getChord } from "@music-analyzer/tonal-objects/src/chord/get";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";

export const convertToTrueTonic = (chord: Chord, scale: Scale) => {
  if (chord.tonic) {
    const tonic = chord.tonic;
    const true_tonic = scale.notes.find(e => getChroma(e) === getChroma(tonic));
    if (true_tonic) {
      return getChord(chord.name.replace(tonic, true_tonic));
    }
  }
  return chord;
};
