import { isSuperSet } from "@music-analyzer/math/src/set/superset";
import { getChroma } from "@music-analyzer/tonal-objects";
import { minorKey } from "@music-analyzer/tonal-objects";
import { Chord } from "@music-analyzer/tonal-objects";

const c_minor = minorKey("C").natural;
type KeyScale = typeof c_minor;
export const doesKeyIncludeTheChord = (key: KeyScale, chord: Chord) => {
  const key_note_chromas = key.scale.map(note => getChroma(note));
  const chord_note_chromas = chord.notes.map(note => getChroma(note));
  return isSuperSet(key_note_chromas, chord_note_chromas);
};
