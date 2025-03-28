import { assertNonNullable as NN } from "@music-analyzer/stdlib/src/assertion/not-null-like";
import { Assertion } from "@music-analyzer/stdlib/src/assertion/assertion";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";
import { getIntervalDegree } from "@music-analyzer/tonal-objects/src/interval/interval-degree";

export const getPowerChroma = (chord: Chord) => {
  const tonic = NN(chord.tonic);
  const fifths = chord.notes.filter(note => getIntervalDegree(tonic, note) == 5);
  new Assertion(fifths.length == 1).onFailed(() => {
    console.log(`received:`);
    console.log(chord.notes);
    throw new Error("received chord must have just one 5th code.");
  });
  return [tonic, fifths[0]].map(note => getChroma(note));
};
