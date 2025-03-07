import { Interval } from "@music-analyzer/tonal-objects";
import { _ArchetypeSymbol, ArchetypeDirectionalSymbol, RetrospectiveSymbol, TrigramProspectiveDirectionalSymbol, TrigramProspectiveSymbol } from "./types";
import { ArchetypeSymbol } from "../..";
import { directionalRetrospectiveSymbol } from "./get-directional-retrospective-symbol";

export const directionalProspectiveSymbol = (symbol: TrigramProspectiveSymbol, realization: Interval): TrigramProspectiveDirectionalSymbol => {
  switch (symbol) {
    case "P":
      if (realization.semitones > 0) { return "uP"; }
      else if (realization.semitones < 0) { return "dP"; }
    case "IP":
      if (realization.semitones > 0) { return "uIP"; }
      else if (realization.semitones < 0) { return "dIP"; }
      else if (realization.semitones === 0) { return "lIP"; }
    case "VP":
      if (realization.semitones > 0) { return "uVP"; }
      else if (realization.semitones < 0) { return "dVP"; }
    case "R":
      if (realization.semitones > 0) { return "uR"; }
      else if (realization.semitones < 0) { return "dR"; }
      else if (realization.semitones === 0) { return "lR"; }
    case "IR":
      if (realization.semitones > 0) { return "uIR"; }
      else if (realization.semitones < 0) { return "dIR"; }
    case "VR":
      if (realization.semitones > 0) { return "uVR"; }
      else if (realization.semitones < 0) { return "dVR"; }
    case "D":
      if (realization.semitones === 0) { return "lD"; }
    case "ID":
      if (realization.semitones > 0) { return "uID"; }
      else if (realization.semitones < 0) { return "dID"; }
    default: throw new Error(
      `Illegal symbol & interval given.
      Given symbol: ${symbol}
      Given interval: ${realization.semitones}`
    );
  }
};

export const directionalSymbol = (
  symbol: ArchetypeSymbol,
  realization: Interval
): ArchetypeDirectionalSymbol => {
  if (symbol === "M" || symbol === "dyad") { return symbol; }
  if (symbol.match(/\(..?\)/)) {
    return directionalRetrospectiveSymbol(symbol as RetrospectiveSymbol, realization);
  }
  else {
    return directionalProspectiveSymbol(symbol as TrigramProspectiveSymbol, realization);
  }
};
