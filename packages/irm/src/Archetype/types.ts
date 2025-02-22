import { IntervalName } from "@music-analyzer/tonal-objects";

export type TrigramProspectiveSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"

export type RetrospectiveSymbol =
  | "(P)" | "(IP)" | "(VP)"
  | "(R)" | "(IR)" | "(VR)"
  | "(D)" | "(ID)"

export type _ProspectiveSymbol = TrigramProspectiveSymbol | "M" | "dyad"
export type _ArchetypeSymbol = "" | _ProspectiveSymbol | RetrospectiveSymbol
export type ProspectiveSymbol = TrigramProspectiveSymbol | "M" | IntervalName
export type ArchetypeSymbol = "" | ProspectiveSymbol | RetrospectiveSymbol
