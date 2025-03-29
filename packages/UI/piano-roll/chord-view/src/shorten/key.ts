import { getCapitalCase } from "@music-analyzer/stdlib/src/string/get-capital-case";
import { getLowerCase } from "@music-analyzer/stdlib/src/string/get-lower-case";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";

export const shortenKey = (key: Scale) => {
  const tonic = key.tonic;
  const type = key.type;
  if (type === "aeolian") { return getLowerCase(`${tonic}-moll`); }
  else if (type === "ionian") { return getCapitalCase(`${tonic}-dur`); }
  else if (type === "minor") { return getCapitalCase(`${tonic}-moll`); }
  else if (type === "major") { return getCapitalCase(`${tonic}-dur`); }
  else { return key.name; }
};
