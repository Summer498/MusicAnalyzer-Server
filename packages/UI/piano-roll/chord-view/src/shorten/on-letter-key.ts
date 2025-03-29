import { getCapitalCase } from "@music-analyzer/stdlib/src/string/get-capital-case";
import { getLowerCase } from "@music-analyzer/stdlib/src/string/get-lower-case";
import { Scale } from"../facade/tonal-object"

export const oneLetterKey = (key: Scale) => {
  const tonic = key.tonic || "";
  const type = key.type;
  if (type === "aeolian") { return getLowerCase(tonic); }
  else if (type === "minor") { return getLowerCase(tonic); }
  else if (type === "ionian") { return getCapitalCase(tonic); }
  else if (type === "major") { return getCapitalCase(tonic); }
  else { return key.name; }
};
