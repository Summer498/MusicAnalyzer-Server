import { isSuperSet } from "@music-analyzer/math";
import { _Key, _Note, Chord } from "@music-analyzer/tonal-objects";

const c_minor = _Key.minorKey("C").natural;
type KeyScale = typeof c_minor;
export const doesKeyIncludeTheChord = (key: KeyScale, chord: Chord) => {
  const key_note_chromas = key.scale.map(note => _Note.chroma(note));
  const chord_note_chromas = chord.notes.map(note => _Note.chroma(note));
  return isSuperSet(key_note_chromas, chord_note_chromas);
};
