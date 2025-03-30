import { Chord } from "@music-analyzer/tonal-objects";
import { getChroma } from "@music-analyzer/tonal-objects";

export const getChordChroma = (chord: Chord) => chord.notes.map(note => getChroma(note));
