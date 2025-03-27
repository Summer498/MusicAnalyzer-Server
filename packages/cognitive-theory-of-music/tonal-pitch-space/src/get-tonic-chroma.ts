import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";

export const getTonicChroma = (chord: Chord) => [getChroma(chord.tonic)];
