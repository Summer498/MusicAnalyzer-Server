import { Chord } from "./facade";
import { getChroma } from "./facade";

export const getChordChroma = (chord: Chord) => chord.notes.map(note => getChroma(note));
