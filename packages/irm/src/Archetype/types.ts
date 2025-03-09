import { IntervalName } from "@music-analyzer/tonal-objects";

export type ProspectiveTriadSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"

export type RetrospectiveTriadSymbol =
  | "(P)" | "(IP)" | "(VP)"
  | "(R)" | "(IR)" | "(VR)"
  | "(D)" | "(ID)"

export type ProspectiveDirectionalTriadSymbol =
  | "uP" | "uIP" | "uVP" | "uR" | "uIR" | "uVR" | "uID"
  | "dP" | "dIP" | "dVP" | "dR" | "dIR" | "dVR" | "dID"
  | "lIP" | "lR" | "lD"

export type RetrospectiveDirectionalTriadSymbol =
  | "(uP)" | "(uIP)" | "(uVP)" | "(uR)" | "(uIR)" | "(uVR)" | "(uID)"
  | "(lIP)" | "(lR)" | "(lD)"
  | "(dP)" | "(dIP)" | "(dVP)" | "(dR)" | "(dIR)" | "(dVR)" | "(dID)"

export type TriadSymbol = ProspectiveTriadSymbol | RetrospectiveTriadSymbol;
export type DirectionalTriadSymbol = ProspectiveDirectionalTriadSymbol | RetrospectiveDirectionalTriadSymbol;

export type _ProspectiveSymbol = ProspectiveTriadSymbol | "M" | "dyad"
export type ProspectiveSymbol = ProspectiveTriadSymbol | "M" | IntervalName
export type _ProspectiveDirectionalSymbol = ProspectiveDirectionalTriadSymbol | "M" | "uDyad" | "dDyad"
export type ProspectiveDirectionalSymbol = ProspectiveDirectionalTriadSymbol | "M" | IntervalName

export type _ArchetypeSymbol = "" | _ProspectiveSymbol | RetrospectiveTriadSymbol
export type ArchetypeSymbol = "" | ProspectiveSymbol | RetrospectiveTriadSymbol
export type _ArchetypeDirectionalSymbol = "" | _ProspectiveDirectionalSymbol | RetrospectiveDirectionalTriadSymbol
export type ArchetypeDirectionalSymbol = "" | ProspectiveDirectionalSymbol | RetrospectiveDirectionalTriadSymbol
