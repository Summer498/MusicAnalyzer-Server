import { assertNonNullable as NN } from "@music-analyzer/stdlib";
import { Assertion } from "@music-analyzer/stdlib";
import { Chord } from "@music-analyzer/tonal-objects";
import { getChroma } from "@music-analyzer/tonal-objects";
import { getIntervalDegree } from "@music-analyzer/tonal-objects";

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
