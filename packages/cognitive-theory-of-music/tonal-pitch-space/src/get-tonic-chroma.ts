import { Chord } from "@music-analyzer/tonal-objects";
import { chromaFromNonNull } from "@music-analyzer/tonal-objects";

export const getTonicChroma = (chord: Chord) => [chromaFromNonNull(chord.tonic)];
