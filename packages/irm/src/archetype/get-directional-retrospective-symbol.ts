import { Interval } from "@music-analyzer/tonal-objects";
import { RetrospectiveDirectionalTriadSymbol, RetrospectiveTriadSymbol } from "./types";

export const directionalRetrospectiveSymbol = (symbol: RetrospectiveTriadSymbol, realization: Interval): RetrospectiveDirectionalTriadSymbol => {
  switch (symbol) {
    case "(P)":
      if (realization.semitones > 0) { return "(uP)"; }
      else if (realization.semitones < 0) { return "(dP)"; }
    case "(IP)":
      if (realization.semitones > 0) { return "(uIP)"; }
      else if (realization.semitones < 0) { return "(dIP)"; }
      else if (realization.semitones === 0) { return "(lIP)"; }
    case "(VP)":
      if (realization.semitones > 0) { return "(uVP)"; }
      else if (realization.semitones < 0) { return "(dVP)"; }
    case "(R)":
      if (realization.semitones > 0) { return "(uR)"; }
      else if (realization.semitones < 0) { return "(dR)"; }
      else if (realization.semitones === 0) { return "(lR)"; }
    case "(IR)":
      if (realization.semitones > 0) { return "(uIR)"; }
      else if (realization.semitones < 0) { return "(dIR)"; }
    case "(VR)":
      if (realization.semitones > 0) { return "(uVR)"; }
      else if (realization.semitones < 0) { return "(dVR)"; }
    case "(D)":
      if (realization.semitones === 0) { return "(lD)"; }
    case "(ID)":
      if (realization.semitones > 0) { return "(uID)"; }
      else if (realization.semitones < 0) { return "(dID)"; }
    default: throw new Error(
      `Illegal symbol & interval given.
      Given symbol: ${symbol}
      Given interval: ${realization.semitones}`
    );
  }
};
