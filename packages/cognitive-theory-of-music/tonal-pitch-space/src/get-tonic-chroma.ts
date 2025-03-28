import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { chromaFromNonNull } from "@music-analyzer/tonal-objects/src/note/chroma-from-non-null";

export const getTonicChroma = (chord: Chord) => [chromaFromNonNull(chord.tonic)];
