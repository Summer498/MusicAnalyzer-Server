import { Scale } from"./facade/tonal-object"
import { oneLetterKey } from "./on-letter-key";

export const shortenKey = (key: Scale) => {
  const type = key.type;
  if (type === "aeolian") { return `${oneLetterKey(key)}-moll`; }
  else if (type === "minor") { return `${oneLetterKey(key)}-moll`; }
  else if (type === "ionian") { return `${oneLetterKey(key)}-dur`; }
  else if (type === "major") { return `${oneLetterKey(key)}-dur`; }
  else { return key.name; }
};
