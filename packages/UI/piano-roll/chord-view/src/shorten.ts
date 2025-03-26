import { getCapitalCase } from "@music-analyzer/stdlib";
import { getLowerCase } from "@music-analyzer/stdlib";
import { Scale } from "@music-analyzer/tonal-objects";

export const shortenChord = (chord: string) => {
  const M7 = chord.replace("major seventh", "M7");
  const major = M7.replace("major", "");
  const minor = major.replace("minor ", "m").replace("minor", "m");
  const seventh = minor.replace("seventh", "7");
  return seventh;
};

export const shortenKey = (key: Scale) => {
  const tonic = key.tonic;
  const type = key.type;
  if (type === "aeolian") { return getLowerCase(`${tonic}-moll`); }
  else if (type === "ionian") { return getCapitalCase(`${tonic}-dur`); }
  else if (type === "minor") { return getCapitalCase(`${tonic}-moll`); }
  else if (type === "major") { return getCapitalCase(`${tonic}-dur`); }
  else { return key.name; }
};

export const oneLetterKey = (key: Scale) => {
  const tonic = key.tonic || "";
  const type = key.type;
  if (type === "aeolian") { return getLowerCase(tonic); }
  else if (type === "ionian") { return getCapitalCase(tonic); }
  else if (type === "minor") { return getCapitalCase(tonic); }
  else if (type === "major") { return getCapitalCase(tonic); }
  else { return key.name; }
};
