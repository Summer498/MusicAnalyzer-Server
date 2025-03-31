import { getChord } from "./facade";
import { getChroma } from "./facade";
import { Chord } from "./facade";
import { Scale } from "./facade";

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
