import { IntervalName } from "@music-analyzer/tonal-objects";

export type TrigramProspectiveSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"

export type TrigramProspectiveDirectionalSymbol =
  | "uP" | "uIP" | "uVP"
  | "uR" | "uIR" | "uVR"
  | "uID"
  | "lIP" | "lR" | "lD"
  | "dP" | "dIP" | "dVP"
  | "dR" | "dIR" | "dVR"
  | "dID"

export type RetrospectiveSymbol =
  | "(P)" | "(IP)" | "(VP)"
  | "(R)" | "(IR)" | "(VR)"
  | "(D)" | "(ID)"

export type RetrospectiveDirectionalSymbol =
| "(uP)" | "(uIP)" | "(uVP)"
| "(uR)" | "(uIR)" | "(uVR)"
| "(uID)"
| "(lIP)" | "(lR)" | "(lD)"
| "(dP)" | "(dIP)" | "(dVP)"
| "(dR)" | "(dIR)" | "(dVR)"
| "(dID)"

export type _ProspectiveSymbol = TrigramProspectiveSymbol | "M" | "dyad"
export type ProspectiveSymbol = TrigramProspectiveSymbol | "M" | IntervalName
export type _ProspectiveDirectionalSymbol = TrigramProspectiveDirectionalSymbol | "M" | "uDyad" | "dDyad"
export type ProspectiveDirectionalSymbol = TrigramProspectiveDirectionalSymbol | "M" | IntervalName

export type _ArchetypeSymbol = "" | _ProspectiveSymbol | RetrospectiveSymbol
export type ArchetypeSymbol = "" | ProspectiveSymbol | RetrospectiveSymbol
export type _ArchetypeDirectionalSymbol = "" | _ProspectiveDirectionalSymbol | RetrospectiveDirectionalSymbol
export type ArchetypeDirectionalSymbol = "" | ProspectiveDirectionalSymbol | RetrospectiveDirectionalSymbol
