import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";

export const getChordChroma = (chord: Chord) => chord.notes.map(note => getChroma(note));
