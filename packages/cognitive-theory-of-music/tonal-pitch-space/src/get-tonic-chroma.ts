import { Chord } from "./facade";
import { chromaFromNonNull } from "./facade";

export const getTonicChroma = (chord: Chord) => [chromaFromNonNull(chord.tonic)];
