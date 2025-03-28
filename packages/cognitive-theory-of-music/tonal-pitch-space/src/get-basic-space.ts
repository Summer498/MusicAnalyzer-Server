import { getOnehot } from "@music-analyzer/math/src/vector/one-hot";
import { vSum } from "@music-analyzer/math/src/vector/sum";
import { RomanChord } from "@music-analyzer/roman-chord/src/roman-chord";
import { Assertion } from "@music-analyzer/stdlib/src/assertion/assertion";
import { getTonicChroma } from "./get-tonic-chroma";
import { getPowerChroma } from "./get-power-chroma";
import { getChordChroma } from "./get-chord-chroma";
import { getScaleChroma } from "./get-scale-chroma";

export const getBasicSpace = (roman: RomanChord) => {
  new Assertion(!roman.scale.empty).onFailed(() => {
    console.log(`received:`);
    console.log(roman.scale);
    throw new Error("scale must not be empty");
  });
  new Assertion(!roman.chord.empty).onFailed(() => {
    console.log(`received:`);
    console.log(roman.chord);
    throw new Error("chord must not be empty");
  });

  const basic_space = vSum(
    getOnehot(getTonicChroma(roman.chord), 12),
    getOnehot(getPowerChroma(roman.chord), 12),
    getOnehot(getChordChroma(roman.chord), 12),
    getOnehot(getScaleChroma(roman), 12),
  );
  return basic_space;
};
