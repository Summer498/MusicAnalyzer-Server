import { RomanChord } from "@music-analyzer/roman-chord";
import { getTonicChroma } from "./get-tonic-chroma";
import { getPowerChroma } from "./get-power-chroma";
import { getChordChroma } from "./get-chord-chroma";
import { getScaleChroma } from "./get-scale-chroma";
import { createAssertion } from "@music-analyzer/stdlib";
import { getOnehot } from "@music-analyzer/math";
import { vSum } from "@music-analyzer/math";

export const getBasicSpace = (roman: RomanChord) => {
  createAssertion(!roman.scale.empty).onFailed(() => {
    console.log(`received:`);
    console.log(roman.scale);
    throw new Error("scale must not be empty");
  });
  createAssertion(!roman.chord.empty).onFailed(() => {
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
