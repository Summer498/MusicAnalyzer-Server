import { getCapitalCase } from "./facade/string";
import { getLowerCase } from "./facade/string";
import { Scale } from"./facade/tonal-object"

export const oneLetterKey = (key: Scale) => {
  const tonic = key.tonic || "";
  const type = key.type;
  if (type === "aeolian") { return getLowerCase(tonic); }
  else if (type === "minor") { return getLowerCase(tonic); }
  else if (type === "ionian") { return getCapitalCase(tonic); }
  else if (type === "major") { return getCapitalCase(tonic); }
  else { return key.name; }
};
