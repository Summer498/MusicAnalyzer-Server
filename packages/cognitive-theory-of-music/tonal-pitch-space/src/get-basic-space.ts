import { getOnehot } from "./facade";
import { vSum } from "./facade";
import { RomanChord } from "./facade";
import { Assertion } from "./facade";
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
