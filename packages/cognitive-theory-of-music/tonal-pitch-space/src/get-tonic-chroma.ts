import { Chord } from "@music-analyzer/tonal-objects";
import { getChroma } from "@music-analyzer/tonal-objects";

export const getTonicChroma = (chord: Chord) => [getChroma(chord.tonic)];
