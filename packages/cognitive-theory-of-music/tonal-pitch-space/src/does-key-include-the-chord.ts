import { isSuperSet } from "./facade";
import { getChroma } from "./facade";
import { minorKey } from "./facade";
import { Chord } from "./facade";

const c_minor = minorKey("C").natural;
type KeyScale = typeof c_minor;
export const doesKeyIncludeTheChord = (key: KeyScale, chord: Chord) => {
  const key_note_chromas = key.scale.map(note => getChroma(note));
  const chord_note_chromas = chord.notes.map(note => getChroma(note));
  return isSuperSet(key_note_chromas, chord_note_chromas);
};
