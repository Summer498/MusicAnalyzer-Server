import { getChord } from "@music-analyzer/tonal-objects";
import { getChroma } from "@music-analyzer/tonal-objects";
import { Chord } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";

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
